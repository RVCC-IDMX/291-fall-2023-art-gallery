function buildMainScreen(name, description) {
    const exhibitName = new PIXI.Text(name);
    const exhibitDescription = new PIXI.Text(description);
    const navButton = new UI.Button(app.view.width, app.view.height, "View Featured Artists >>");
    navButton.x -= navButton.width;
    navButton.y -= navButton.height;
    navButton.onclick = () => {
        Director.showScene("catalog", { transition: Director.swipe, direction: "left", duration: 750 });
    };
    mainScreen.addChild(exhibitName);
    mainScreen.addChild(exhibitDescription);
    mainScreen.addChild(navButton);
    exhibitDescription.y = exhibitName.height + exhibitName.y;
}

function buildArtistCatalog(artistPages) {
    // const carouselMaskLeft = new PIXI.Graphics();
    // const carouselMaskRight = new PIXI.Graphics();
    // carouselMaskLeft.beginFill(mainBackgroundColor);
    // carouselMaskLeft.drawRect(
    //   0,
    //   0,
    //   100,
    //   650
    // );
    // carouselMaskRight.beginFill(mainBackgroundColor);
    // carouselMaskRight.drawRect(
    //   0,
    //   0,
    //   100,
    //   650
    // );
    // carouselMaskLeft.y = app.view.height / 2 - carouselMaskLeft.height / 2;
    // carouselMaskRight.y = app.view.height / 2 - carouselMaskRight.height / 2;
    // carouselMaskRight.x = app.view.width - carouselMaskRight.width;
    const catalog = new PIXI.Container();
    artistCatalog.addChild(catalog);
    let count = 0;
    artistPages.forEach(page => {
        Director.addScene(count, page); // Adding each page to the director
        const artist = new PIXI.Container();
        artist.viewIndex = count; // Giving the artist photo a reference to the page it's supposed to lead to
        const placeHolder = new PIXI.Graphics();
        const name = new PIXI.Text("Artist Name");
        placeHolder.beginFill(0x999999);
        placeHolder.drawRect(0, 0, 450, 650);
        artist.addChild(placeHolder);
        artist.addChild(name);
        catalog.addChild(artist);
        if (count > 0) {
            artist.x = catalog.children[count - 1].x + artist.width + 50;
        } else {
            artist.x = carouselMaskLeft.width;
        }
        count += 1;
    });
    // artistCatalog.addChild(carouselMaskLeft);
    // artistCatalog.addChild(carouselMaskRight);

    catalog.y = app.view.height / 2 - catalog.height / 2;

    catalog.interactive = true;
    catalog.dragging = false;
    catalog.on('pointerdown', (e) => {
        catalog.calculateBounds();
        catalog.offsetX = catalog.x - e.global.x;
        catalog.offsetY = catalog.y - e.global.y;
        catalog.dragging = true;
    });
    catalog.on('pointermove', (e) => {
        if (catalog.dragging) {
            catalog.x = e.global.x + catalog.offsetX;
            //Check constraints
            if (catalog.width > 0.75 * app.view.width) {
                if (catalog.x < -catalog.width + 0.75 * app.view.width) {
                    //Right limit
                    catalog.x = -catalog.width + 0.75 * app.view.width;
                } else if (catalog.x > 0.25 * app.view.width) {
                    //Left limit
                    catalog.x = 0.25 * app.view.width;
                }
            } else {
                catalog.x = horizontalPadding + 200;
            }
        }
    });

    catalog.on('pointerup', (e) => {
        catalog.dragging = false;
    });
    catalog.on('pointerupoutside', (e) => {
        catalog.dragging = false;
    });
    // console.log(catalog.children);
    catalog.children.forEach(artist => {
        artist.interactive = true;
        artist.interactionTimeStamp = Date.now();
        artist.on("pointerdown", (e) => {
            artist.interactionTimeStamp = Date.now();
        });
        artist.on("pointerup", (e) => {
            if (Date.now() - artist.interactionTimeStamp <= 150) {
                Director.showScene(`${artist.viewIndex}`, { transition: Director.swipe, direction: "down", duration: 1000 });
            }

        });
    });
}
