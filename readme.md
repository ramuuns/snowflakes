#Snowflakes

for this holiday season we give you a simple way to annoy your website visitors and waste their CPU cycles - Yes you've guessed it snowflakes on a webpage.

Now we know, this used to be done the old fashion way in the 90ies, but now we have `canvas` and `pointer-events:none`, so the pesky things won't interfere with anything else on the page.

Say thank you to @mrserge for asking me if I can code this useless thing.

Oh, usage:

add a script tag pointing to snowflakes.js, and then in your domready function call `window.snowflakes();`

You can also pass an options object, where you can configure the behaviour of this thing.
The following options are available:

    amount // int, defaults to 250
    color // string, any css color, defaults to #fff
    nuclearMode // boolean, defaults to false - overrides the color setting
    invertDirection // boolean, defaults to false
