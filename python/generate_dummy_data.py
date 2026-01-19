import csv
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import List


@dataclass
class BatterySample:
    uuid: str
    timestamp: datetime
    received: datetime
    level: float
    connected_type: int
    status: int
    temperature: int
    device_type: int


def generate_daily_battery_profile(
    device_uuid: str,
    day: datetime,
    samples_per_day: int = 1440,
) -> List[BatterySample]:
    """
    Generate 1-day battery data at 1-minute resolution (1440 samples).

    Pattern (rough but realistic):
      - 00:00–06:00: plugged in, level 80→100 (slow top-up)
      - 06:00–09:00: unplugged, level 100→70 (morning use)
      - 09:00–12:00: light use, 70→60
      - 12:00–18:00: heavier use, 60→20
      - 18:00–22:00: recharging, 20→100
      - 22:00–24:00: plugged, 100% idle
    """

    # Ensure timezone-aware timestamps for PostgreSQL timestamp with time zone
    if day.tzinfo is None:
        # If naive, assume UTC
        base = day.replace(hour=0, minute=0, second=0, microsecond=0).replace(tzinfo=timezone.utc)
    else:
        # Convert to UTC and keep timezone info
        base = day.astimezone(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    interval = timedelta(minutes=1440 // samples_per_day)
    samples: List[BatterySample] = []

    for i in range(samples_per_day):
        ts = base + i * interval
        minute_of_day = ts.hour * 60 + ts.minute

        # Determine connected_type + status + target level curve
        # connected_type: 0 = unplugged, 1-3 = different connection types
        # status: 0 = discharging, 1 = charging, 2 = full
        if 0 <= minute_of_day < 360:  # 00:00–06:00
            connected_type = 1  # AC power
            status = 1 if minute_of_day < 300 else 2  # charging or full
            level = 80 + (minute_of_day / 360) * 20  # 80→100
            base_temp = 27
        elif 360 <= minute_of_day < 540:  # 06:00–09:00
            connected_type = 0  # Unplugged
            status = 0  # discharging
            level = 100 - ((minute_of_day - 360) / 180) * 30  # 100→70
            base_temp = 32
        elif 540 <= minute_of_day < 720:  # 09:00–12:00
            connected_type = 0  # Unplugged
            status = 0  # discharging
            level = 70 - ((minute_of_day - 540) / 180) * 10  # 70→60
            base_temp = 34
        elif 720 <= minute_of_day < 1080:  # 12:00–18:00
            connected_type = 0  # Unplugged
            status = 0  # discharging
            level = 60 - ((minute_of_day - 720) / 360) * 40  # 60→20
            base_temp = 38
        elif 1080 <= minute_of_day < 1320:  # 18:00–22:00
            connected_type = 2  # USB power (varied connection type)
            status = 1  # charging
            level = 20 + ((minute_of_day - 1080) / 240) * 80  # 20→100
            base_temp = 36
        else:  # 22:00–24:00
            connected_type = 3  # Wireless charging (varied connection type)
            status = 2  # full
            level = 100.0
            base_temp = 30

        # Clamp level to [0, 100]
        level = max(0.0, min(100.0, level))

        # Simple pseudo-random noise based on timestamp to avoid importing `random`
        noise = ((ts.minute * 37 + ts.hour * 11) % 5) - 2  # -2..+2
        temperature = int(base_temp + noise)

        samples.append(
            BatterySample(
                uuid=device_uuid,
                timestamp=ts,
                received=ts,  # Set received same as timestamp
                level=int(level),
                connected_type=connected_type,
                status=status,
                temperature=temperature,
                device_type=0,  # Set device_type to 0
            )
        )

    return samples


def write_csv(samples: List[BatterySample], fileobj=sys.stdout) -> None:
    writer = csv.writer(fileobj)
    # Header compatible with your table schema
    writer.writerow(["uuid", "timestamp", "received", "level", "connected_type", "status", "temperature", "device_type"])
    for s in samples:
        # Format timestamps with timezone for PostgreSQL timestamp with time zone
        # Format: 'YYYY-MM-DD HH:MM:SS+TZ:TZ' (e.g., '2024-01-01 12:00:00+00:00')
        # Use isoformat() and replace 'T' with space, and ensure timezone format
        timestamp_iso = s.timestamp.isoformat()
        timestamp_str = timestamp_iso.replace('T', ' ')
        # Ensure timezone has colon (isoformat() already includes it for timezone-aware datetimes)
        
        received_iso = s.received.isoformat()
        received_str = received_iso.replace('T', ' ')
        
        writer.writerow(
            [
                s.uuid,
                timestamp_str,
                received_str,
                s.level,
                s.connected_type,
                s.status,
                s.temperature,
                s.device_type,
            ]
        )


def main():
    """
    Example:
      - Generates 1 day (1440 samples) for a single device
      - Day defaults to "today" in UTC
    """
    device_uuid = 'c2115b3b-4499-497f-ad65-5832290e7c30'
    today_utc = datetime.now(timezone.utc)

    samples = generate_daily_battery_profile(
        device_uuid=device_uuid,
        day=today_utc,
        samples_per_day=1440,
    )

    # Use newline='' to avoid blank lines in CSV on Windows
    with open("battery_data.csv", "w", newline="", encoding="utf-8") as f:
        write_csv(samples, fileobj=f)


if __name__ == "__main__":
    main()


