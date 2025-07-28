
I tried different configurations to experiment with this task.

I first tried using a asingle convulational laer and a dense layer, this gave me an accuracy of around 70%, I added more layers, first I added another convulational layer and this increased accuracy by more than 10%, I then increased the filter sizes and added pooling layers,
for the dense layer configuration I tried 128 units which gave me a good result, I finally added a dropout to prevent overfitting, i used 0.5 which seemed to work well.