@echo off
echo Installing Bun dependencies...
bun install

echo Installing hono package...
bun add hono

echo Backend setup complete!
pause