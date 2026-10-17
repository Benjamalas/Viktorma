# Viktorma Shop (Shopify theme)

Online Store 2.0 theme for the parts shop. Shares `assets/theme.css` and `assets/motion.js` with the landing page (copies are kept here because Shopify only serves files inside the theme folder; copy them over again if the landing look changes). Shop-only styles are in `assets/shop.css` and `assets/shop.js`. Copy is Lithuanian.

## 1. Load it into your store
Needs your own Shopify store (a trial is fine, nothing is charged to build and preview).
- Zip the contents of this folder (so `layout/`, `sections/` ... are at the zip root) and upload at **Online Store → Themes → Add theme → Upload zip file**, or
- connect the GitHub repo (Themes → Add theme → Connect from GitHub), branch of this PR, folder `shopify-theme`.

Then open the theme **Customize** editor, fill in company details under **Theme settings → Įmonės duomenys**, and publish when ready.

## 2. Create the part fields (once)
**Settings → Custom data → Products → Add definition.** Namespace and key must match (`custom.*`). Enable **Storefront access** on every one.

| Name | Key | Type |
|---|---|---|
| Manufacturer | `manufacturer` | Single line text |
| Models | `models` | List of single line text |
| Years | `years` | List of single line text |
| Gearbox code | `gearbox_code` | Single line text |
| Gearbox type | `gearbox_type` | Single line text |
| Part number | `part_number` | Single line text |
| Condition | `condition` | Single line text |

## 3. Turn on the filters
Install the free **Shopify Search & Discovery** app → **Filters → Add filter** and add: Manufacturer, Years, Gearbox code, Gearbox type, Condition, Models, Price, Availability. The theme draws whatever filters you configure, on the collection pages and in search. The home page "Raskite dalį" box uses the Manufacturer and Years filters.

## 4. Add parts
Either add products by hand, or import `import/products_template.csv` (**Products → Import**). It holds 6 sample parts as drafts (no images). Replace them with the real list in the same columns. List columns (`models`, `years`) take JSON arrays like `["2005","2006"]`.

## 5. Store setup
Menus (**Navigation**): `main-menu` and `footer`. Create a collection for the home page "Naujausios dalys". Add **Privacy / Refund / Terms** policies (**Settings → Policies**), they appear in the footer. Language: set Lithuanian; payments, shipping and taxes in Settings; checkout is Shopify's own.
