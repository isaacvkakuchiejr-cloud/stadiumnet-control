# StadiumNet Control

Create a responsive web application called StadiumNet, a network operations dashboard for a soccer stadium.

The application should help a network engineer monitor the stadium's Wi-Fi access points, security cameras, ticket scanners, scoreboard systems, media equipment, team staff devices, and concession payment systems.

Create a professional dark-blue dashboard with the following pages:

Overview: Display total devices, online devices, offline devices, active alerts, average latency, packet loss, and bandwidth usage.

Devices: Create a searchable table containing device name, device type, IP address, VLAN, stadium location, connection status, latency, and bandwidth usage.

Network Topology: Show a visual representation of a router connected to switches and different stadium systems.

Alerts: Display warnings for offline devices, high latency, excessive bandwidth usage, and packet loss.

Stadium Zones: Separate devices into entrances, field level, seating areas, press box, team facilities, and concessions.

Use realistic simulated data. Add filters for device type, stadium zone, VLAN, and status. Do not add real authentication or external APIs yet. Focus on producing a working first version with clean organization and reusable components.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ab84664-5474-4f1c-8908-69067ffee97f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
