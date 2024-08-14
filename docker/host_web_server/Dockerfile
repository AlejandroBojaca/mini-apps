# Use a lightweight debian os
# as the base image
FROM debian:stable-slim

# COPY source destination
COPY caddy_boot_dev /caddy_boot_dev

ENV PORT=8080

CMD ["/caddy_boot_dev"]

