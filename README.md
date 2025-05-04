Ezt Csabi dogozta ki.

Hozzátesszük a frontend tesztet

# A Playwright utólagos telepítése
1. A Frontend mappában: `npm install --save-dev playwright`

2. A Playwright böngészük telepítése: `npx playwright install`
    - Konkrétan adott böngészőt is telepíthetsz: `npx playwright install --with-deps chromium firefox`

3. A telepítés ellenőrzése:  `npx playwright --version`   

## Az npx
Az npx egy kényelmes és hatékony eszköz Node.js ökoszisztémában lévő végrehajtható fájlok futtatására anélkül, hogy azokat globálisan kellene telepíteni. Segít a verziókezelésben, a globális ütközések elkerülésében és az egyszeri használatra szánt eszközök egyszerű futtatásában.



