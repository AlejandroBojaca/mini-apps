import pyautogui
import time

# Wait a few seconds to switch to the target window
# time.sleep(3)

# Move mouse to a specific position and click
for _ in range(500):
    pyautogui.moveTo(1410, 500, duration=0.3)
    pyautogui.click()
    pyautogui.click()
    pyautogui.moveTo(1000, 55, duration=0.3)
    pyautogui.click()
    pyautogui.hotkey('command', 'c')

    pyautogui.moveTo(250, 50, duration=0.3)
    pyautogui.click()
    pyautogui.moveTo(1410, 500, duration=0.3)
    pyautogui.hotkey('command', 'v')
    
    pyautogui.hotkey('enter')

