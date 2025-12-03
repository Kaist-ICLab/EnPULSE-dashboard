import uuid
import csv
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import List


@dataclass
class BatterySample:
    uuid: str
    timestamp: datetime
    level: float
    plugged: str
    status: str
    temperature: int


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

    if day.tzinfo is None:
        # store timestamps as "naive UTC" (common with `timestamp without time zone`)
        base = day.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        base = (
            day.astimezone(timezone.utc)
            .replace(hour=0, minute=0, second=0, microsecond=0)
            .replace(tzinfo=None)
        )

    interval = timedelta(minutes=1440 // samples_per_day)
    samples: List[BatterySample] = []

    for i in range(samples_per_day):
        ts = base + i * interval
        minute_of_day = ts.hour * 60 + ts.minute

        # Determine plugged + status + target level curve
        if 0 <= minute_of_day < 360:  # 00:00–06:00
            plugged = "AC"
            status = "charging" if minute_of_day < 300 else "full"
            level = 80 + (minute_of_day / 360) * 20  # 80→100
            base_temp = 27
        elif 360 <= minute_of_day < 540:  # 06:00–09:00
            plugged = "UNPLUGGED"
            status = "discharging"
            level = 100 - ((minute_of_day - 360) / 180) * 30  # 100→70
            base_temp = 32
        elif 540 <= minute_of_day < 720:  # 09:00–12:00
            plugged = "UNPLUGGED"
            status = "discharging"
            level = 70 - ((minute_of_day - 540) / 180) * 10  # 70→60
            base_temp = 34
        elif 720 <= minute_of_day < 1080:  # 12:00–18:00
            plugged = "UNPLUGGED"
            status = "discharging"
            level = 60 - ((minute_of_day - 720) / 360) * 40  # 60→20
            base_temp = 38
        elif 1080 <= minute_of_day < 1320:  # 18:00–22:00
            plugged = "AC"
            status = "charging"
            level = 20 + ((minute_of_day - 1080) / 240) * 80  # 20→100
            base_temp = 36
        else:  # 22:00–24:00
            plugged = "AC"
            status = "full"
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
                level=float(f"{level:.2f}"),
                plugged=plugged,
                status=status,
                temperature=temperature,
            )
        )

    return samples


def write_csv(samples: List[BatterySample], fileobj=sys.stdout) -> None:
    writer = csv.writer(fileobj)
    # Header compatible with your table schema
    writer.writerow(["uuid", "timestamp", "level", "plugged", "status", "temperature"])
    for s in samples:
        writer.writerow(
            [
                s.uuid,
                s.timestamp.isoformat(sep=" "),
                f"{s.level:.2f}",
                s.plugged,
                s.status,
                s.temperature,
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


