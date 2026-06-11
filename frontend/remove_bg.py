import numpy as np
from PIL import Image

img = Image.open('/Users/drikshathakur/Documents/bugtracker/frontend/public/logo.png').convert("RGBA")
data = np.array(img).astype(float)

bg_color = np.array([14, 15, 17])

r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
dist = np.sqrt((r-bg_color[0])**2 + (g-bg_color[1])**2 + (b-bg_color[2])**2)

alpha = np.clip((dist - 15) * (255.0 / 45.0), 0, 255)
data[:,:,3] = alpha

alpha_norm = np.clip(alpha / 255.0, 0.1, 1.0)
data[:,:,0] = np.clip(data[:,:,0] / alpha_norm, 0, 255)
data[:,:,1] = np.clip(data[:,:,1] / alpha_norm, 0, 255)
data[:,:,2] = np.clip(data[:,:,2] / alpha_norm, 0, 255)

img_out = Image.fromarray(data.astype(np.uint8))
img_out.save('/Users/drikshathakur/Documents/bugtracker/frontend/public/logo.png')
print("Background removed")
