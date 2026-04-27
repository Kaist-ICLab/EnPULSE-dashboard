import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/campaigns/:id(\\d+)',
                destination: '/campaigns/:id/dashboard',
                permanent: false,
            },
        ];
    },
};

export default withFlowbiteReact(nextConfig);