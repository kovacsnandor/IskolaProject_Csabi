Ezt Csabi dogozta ki.

Hozzátesszük a frontend tesztet

# A Playwright utólagos telepítése
[Playwright](https://playwright.dev/docs/intro)

Elég a 4. pont, az mindent megcsinál:
(
1. A Frontend mappában: `npm install --save-dev playwright`

2. A Playwright böngészük telepítése: `npm install playwright@latest --save-dev`
    - Konkrétan adott böngészőt is telepíthetsz: `npx playwright install --with-deps chromium firefox`

3. A telepítés ellenőrzése:  `npx playwright --version` 
) 

4. Inicializáld a Playwright konfigurációt: `npm init playwright@latest`
    - Elég ezt a parancsot letölteni, Ez még a csomagot is lehozza.
    - javascript
    - böngészők telepítése is megtörténik

## A tesztek futtatása


- end-to-end tests: `npx playwright test`   
- csak a chrome böngészőben: `npx playwright test --project=chromium`
- Adott fájl tesztjeit futtatja: `npx playwright test example`
- Teszt futtatása deebug módban: `npx playwright test --debug`

- A teszt eredménye böngészőben: `npx playwright show-report`



## Az npx
Az npx egy kényelmes és hatékony eszköz Node.js ökoszisztémában lévő végrehajtható fájlok futtatására anélkül, hogy azokat globálisan kellene telepíteni. Segít a verziókezelésben, a globális ütközések elkerülésében és az egyszeri használatra szánt eszközök egyszerű futtatásában.





