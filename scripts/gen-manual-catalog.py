"""Generate manual-catalog.csv — human QA only (no Playwright duplicates, no CI/SEO/dev checks)."""
import csv
from collections import Counter
from pathlib import Path

HEADER = [
    "TC_ID", "Module", "Cas_manuel_recette", "Type_test", "Priorite",
    "Prerequis", "Donnees_test", "Etapes", "Resultat_attendu",
    "Resultat_obtenu", "Date_execution", "Executant", "Environnement", "Automatise",
]

BASE = "Storefront staging; published catalog"
GUEST = "Guest session; in-stock product"
STAGING_PAY = "Staging; test payment methods enabled"

MODULE_ORDER = [
    "Storefront", "Navigation", "i18n", "Search", "Shop", "PDP", "Cart",
    "Checkout", "Payment", "Post-purchase", "Contact", "Magazine", "Admin",
]
TYPE_ORDER = ["Sign-off", "Exploratory", "Negative"]

# (module, title, type_test, prio, prereq, data, steps, expected[, auto])
CASES = [
    # ── Storefront — visual, content, brand ─────────────────────────────────
    ("Storefront", "FR home first impression brand hero and sections", "Sign-off", "P0", BASE, "FR locale",
     "Open /fr/ on desktop, Scan hero featured sections footer, No broken images or lorem", "Home looks production-ready"),
    ("Storefront", "EN home copy and layout parity with FR", "Sign-off", "P1", BASE, "EN locale",
     "Open /en/, Compare key sections to FR, Copy is natural not raw keys", "EN home credible for launch"),
    ("Storefront", "FAQ privacy terms shipping returns readable", "Sign-off", "P1", "Pages published",
     "FAQ privacy terms shipping-policy returns-policy", "Open each legal page read hero and body", "Legal pages acceptable"),
    ("Storefront", "About science export professionnels feedback stories", "Sign-off", "P1", "Content pages live",
     "a-propos science export professionnels feedback-stories", "Open each info page scan content and CTAs", "Brand pages coherent"),
    ("Storefront", "Footer contact email and social profiles", "Sign-off", "P1", "Social accounts live", "Instagram Facebook Pinterest",
     "Click mailto and each social link, Confirm correct destination", "Contact and social links correct"),
    ("Storefront", "Home category showcase and magazine strip links", "Sign-off", "P1", BASE, "Home FR",
     "Click category tiles and magazine strip cards", "Home merchandising links work"),

    ("Storefront", "Home featured products match merchandising intent", "Exploratory", "P1", "Featured configured in admin", "Home FR",
     "Compare home cards to admin featured list", "Right products promoted"),
    ("Storefront", "Home Google reviews and trust strip credible", "Exploratory", "P1", BASE, "Home FR",
     "Read reviews carousel and trust badges", "Social proof looks authentic not broken"),
    ("Storefront", "Cosmetics copy no prohibited medical claims", "Exploratory", "P0", "Legal review mindset", "Home PDP FAQ",
     "Spot-check product and page copy FR and EN", "No non-compliant health claims"),
    ("Storefront", "Newsletter block honest if not yet wired", "Exploratory", "P2", BASE, "Home newsletter",
     "Try subscribe note behavior", "No fake success or silent fail"),
    ("Storefront", "Real device mobile home and navigation", "Exploratory", "P0", "Phone or BrowserStack", "iOS or Android",
     "Browse home shop cart on real device", "Usable without horizontal scroll or blocked CTAs"),
    ("Storefront", "Cross-browser spot check Safari and Chrome", "Exploratory", "P1", "Safari and Chrome", "Home shop checkout",
     "Repeat core path in second browser", "No layout or payment blockers"),

    # ── Navigation ──────────────────────────────────────────────────────────
    ("Navigation", "Primary nav and mobile menu complete journey", "Sign-off", "P0", BASE, "Desktop and mobile",
     "Use header nav and mobile menu to reach shop magazine cart", "All main entry points reachable"),
    ("Navigation", "Footer links land on expected pages", "Sign-off", "P1", BASE, "Footer",
     "Click each footer link once", "No 404 and titles match expectations"),
    ("Navigation", "Footer category links filter shop correctly", "Sign-off", "P1", "Categories in footer", "Footer shop column",
     "Click footer category links verify filtered shop", "Category deep links work"),

    # ── i18n ────────────────────────────────────────────────────────────────
    ("i18n", "FR EN switch on home shop PDP checkout", "Sign-off", "P0", BASE, "FR and EN",
     "Switch locale on four page types, Labels and URLs coherent", "Bilingual experience consistent"),
    ("i18n", "EUR MAD currency on shop cart checkout", "Sign-off", "P0", BASE, "EUR and MAD",
     "Change currency through shop add to cart checkout", "Prices and symbols make sense end-to-end"),

    ("i18n", "EN copy reads naturally not machine translated", "Exploratory", "P1", "EN locale", "Shop PDP checkout contact",
     "Read headings CTAs error messages aloud", "Natural English throughout"),

    # ── Search ──────────────────────────────────────────────────────────────
    ("Search", "Search finds known product and handles no results", "Sign-off", "P1", "Indexed catalog", "Known SKU name and nonsense",
     "Search real product name then gibberish", "Relevant result then friendly empty state"),

    # ── Shop ────────────────────────────────────────────────────────────────
    ("Shop", "Browse filter sort and paginate like a shopper", "Sign-off", "P0", "Multi-page catalog", "Category and sort",
     "Open shop apply filter change sort go page 2 open PDP", "Results match filters sort feels correct"),
    ("Shop", "Staff picks page reflects curated products", "Sign-off", "P1", "Picks configured", "Staff picks URL",
     "Open staff picks compare to admin selection", "Curated list matches intent"),

    ("Shop", "Filter labels match visible products", "Exploratory", "P1", BASE, "Category filter e.g. bath",
     "Apply filter scan first row of cards", "Products belong to selected category"),
    ("Shop", "Product card images and prices look correct", "Exploratory", "P1", BASE, "Shop grid",
     "Scan grid for broken images odd prices truncated titles", "Grid visually trustworthy"),

    # ── PDP ─────────────────────────────────────────────────────────────────
    ("PDP", "In-stock product page complete and trustworthy", "Sign-off", "P0", GUEST, "Default in-stock slug",
     "Open PDP check title price images description ATC reviews breadcrumb", "Ready to buy impression"),
    ("PDP", "Out-of-stock product messaging clear to customer", "Sign-off", "P0", "OOS product in catalog", "OOS slug",
     "Open OOS PDP, Customer understands cannot buy now", "No misleading buy button"),

    ("PDP", "Product images gallery usable on mobile", "Exploratory", "P1", "Mobile viewport or device", "PDP with gallery",
     "Swipe or tap gallery on phone", "Images clear and navigable"),
    ("PDP", "Cross-sell block shows related not duplicate product", "Exploratory", "P2", "PDP with cross-sell", "In-stock PDP",
     "Review related products strip", "Suggestions relevant"),
    ("PDP", "Ingredients and usage copy readable compliance", "Exploratory", "P0", "Cosmetics PDP", "Product with INCI",
     "Read description and ingredients section", "Complete and compliant presentation"),
    ("PDP", "Product reviews credible and appropriate", "Exploratory", "P1", "PDP with reviews", "Published avis",
     "Read featured and list reviews check tone authenticity", "Reviews trustworthy for customers"),

    ("PDP", "Broken product URL shows friendly not-found", "Negative", "P2", BASE, "Invalid slug",
     "Open fake product URL", "Clear 404 not white screen"),

    # ── Cart ────────────────────────────────────────────────────────────────
    ("Cart", "Guest add edit remove cart through checkout entry", "Sign-off", "P0", GUEST, "One in-stock product",
     "Add from PDP change qty remove re-add open checkout from drawer", "Cart behaves predictably"),
    ("Cart", "Cart survives refresh and locale or currency change", "Sign-off", "P1", GUEST, "Line in cart",
     "Reload switch locale switch currency reopen cart", "Line and prices still sensible"),

    ("Cart", "Empty cart state clear path back to shopping", "Exploratory", "P2", "Empty cart", "Header cart icon",
     "Open empty cart read message use continue shopping", "Guest not stuck"),

    # ── Checkout ────────────────────────────────────────────────────────────
    ("Checkout", "Guest checkout address shipping and order summary", "Sign-off", "P0", GUEST, "Filled cart valid address",
     "Enter real-looking address pick shipping verify lines total taxes delivery", "Summary matches expectations"),
    ("Checkout", "Standard vs express shipping choice when offered", "Sign-off", "P1", GUEST, "Address with both methods",
     "Select each shipping option compare cost and ETA copy", "Both options clear and priced"),
    ("Checkout", "Switch COD and CMI before placing order", "Sign-off", "P1", STAGING_PAY, "Both methods enabled",
     "Toggle payment radios verify hints and place order path", "Payment choice clear for customer"),
    ("Checkout", "Shipping cost reasonable for city vs remote", "Exploratory", "P1", "Non-empty cart", "Casablanca vs other city",
     "Quote shipping for two addresses compare amounts", "Tariffs believable for Morocco"),
    ("Checkout", "Trust badges returns and payment icons visible", "Exploratory", "P2", GUEST, "Checkout page",
     "Read trust copy and card brand icons", "Reassurance content present"),

    ("Checkout", "Empty required fields blocked with clear errors", "Negative", "P0", GUEST, "Filled cart",
     "Try submit with missing name email address", "Errors visible before order"),
    ("Checkout", "Invalid email and phone rejected inline", "Negative", "P1", GUEST, "Bad email and phone",
     "Enter invalid email and phone blur fields", "Inline errors understandable"),
    ("Checkout", "Out-of-zone address shows delivery error", "Negative", "P1", "Address outside zones", "Edge address",
     "Enter unsupported region wait for quote", "Clear cannot deliver message"),
    ("Checkout", "CMI failure return shows retry message on checkout", "Negative", "P0", "CMI sandbox", "Failed or cancelled payment",
     "Return from failed CMI attempt land on checkout", "Clear failure message cart intact can retry or use COD"),

    # ── Payment ─────────────────────────────────────────────────────────────
    ("Payment", "COD order end-to-end on staging", "Sign-off", "P0", STAGING_PAY, "Valid guest checkout",
     "Complete COD order reach thank-you note reference", "Order placed reference shown"),
    ("Payment", "CMI sandbox successful card payment", "Sign-off", "P0", "CMI sandbox credentials", "Test card success",
     "Pay with CMI test card return to site thank-you", "Payment succeeds flow smooth"),
    ("Payment", "Promo valid code lowers checkout total", "Sign-off", "P1", "Staging; SAVE10 in admin Codes promo", "SAVE10",
     "Cart with product apply SAVE10 at checkout confirm badge and lower total optional COD thank-you total matches",
     "Discount visible and total math correct for customer", "Partial"),
    ("Payment", "Multi quantity order totals correct end to end", "Sign-off", "P1", GUEST, "Qty 2 or 3 same SKU",
     "Order multiple units verify checkout thank-you email admin lines", "Qty and line totals consistent everywhere"),

    ("Payment", "CMI declined card shows clear failure", "Negative", "P0", "CMI sandbox", "Decline test card",
     "Attempt pay with failing card", "User knows payment failed can retry"),
    ("Payment", "CMI cancel on gateway returns safely", "Negative", "P0", "CMI sandbox", "Cancel on gateway",
     "Start CMI payment cancel return", "Back on checkout cart intact"),
    ("Payment", "Promo invalid code rejected", "Negative", "P1", "Staging; cart with product", "INVALID-QA-XXXX",
     "Apply fake code at checkout", "Clear error total unchanged", "Partial"),
    ("Payment", "Promo empty submit blocked", "Negative", "P2", "Staging; cart with product", "Empty promo field",
     "Click Appliquer without code", "Validation message no discount applied", "Partial"),
    ("Payment", "COD blocked when address incomplete", "Negative", "P1", STAGING_PAY, "Incomplete address",
     "Attempt COD with missing fields", "Order not placed"),

    # ── Post-purchase ─────────────────────────────────────────────────────
    ("Post-purchase", "Thank-you page matches order just placed", "Sign-off", "P0", "Fresh test order", "COD or CMI order",
     "On thank-you verify ref items total match checkout", "Confirmation trustworthy"),
    ("Post-purchase", "Order confirmation email received and correct", "Sign-off", "P0", "SMTP staging inbox", "Same test order",
     "Open email check products total address ref link", "Email accurate and branded"),

    ("Post-purchase", "Thank-you without valid reference handled", "Negative", "P2", BASE, "Direct URL no ref",
     "Open thank-you page without order context", "No fake success message"),

    # ── Contact ───────────────────────────────────────────────────────────
    ("Contact", "Contact form submission and acknowledgement", "Sign-off", "P0", "Contact page live", "Valid test message",
     "Submit real inquiry see on-screen success", "User confidence message sent"),
    ("Contact", "Contact notification received by team inbox", "Sign-off", "P1", "Mail routing configured", "Test submission",
     "Check operations inbox for contact mail", "Team receives inquiry"),

    ("Contact", "Empty and invalid contact form rejected", "Negative", "P1", "Contact page", "Empty and bad email",
     "Submit blank form then bad email", "Validation messages clear"),

    # ── Magazine ────────────────────────────────────────────────────────────
    ("Magazine", "Magazine browse read and follow product CTA", "Sign-off", "P0", "Published articles", "Article with product CTA",
     "Listing open article read content click product CTA reach PDP", "Editorial funnel works"),
    ("Magazine", "Section hub and topics navigation intuitive", "Sign-off", "P1", "Sections and topics live", "Magazine hubs",
     "Navigate section hub topics back to articles", "Reader can explore content"),

    ("Magazine", "Article layout readable on mobile", "Exploratory", "P1", "Mobile device", "Long article",
     "Read article on phone images TOC CTAs", "Comfortable reading experience"),
    ("Magazine", "Article product CTA contextually relevant", "Exploratory", "P1", "Article with embedded product", "Editorial page",
     "Judge if recommended product fits article topic", "CTA feels editorial not spam"),
    ("Magazine", "Article FR EN parity when translation exists", "Exploratory", "P2", "Bilingual article", "Same article both locales",
     "Open FR and EN versions compare title body CTA", "Translation complete not half-empty"),

    ("Magazine", "Missing article shows friendly not-found", "Negative", "P2", BASE, "Fake slug",
     "Open nonexistent article URL", "Clear 404"),

    # ── Admin — operator workflows only ─────────────────────────────────────
    ("Admin", "Login and dashboard access", "Sign-off", "P0", "Admin staging account", "Admin user",
     "Login land on dashboard open orders products", "Operator can work"),
    ("Admin", "Create or edit product visible on storefront", "Sign-off", "P0", "Admin product access", "Test product",
     "Create or update product stock price image check PDP", "Storefront reflects change"),
    ("Admin", "Publish magazine article visible on site", "Sign-off", "P1", "Admin magazine access", "Draft article",
     "Publish article open magazine on storefront", "Article live with correct title image"),
    ("Admin", "Placed order visible with correct status and lines", "Sign-off", "P0", "Order from payment sign-off", "Test order ref",
     "Find order in admin open detail", "Lines total status match storefront order"),
    ("Admin", "Shipping zone change reflects checkout quote", "Sign-off", "P1", "Shipping admin access", "Zone or rate edit",
     "Adjust rate rerun checkout quote", "New rate visible to customer"),
    ("Admin", "Category change visible in shop filters and footer", "Sign-off", "P1", "Category admin access", "Test category",
     "Create or rename category check shop filter and footer link", "Category discovery updated"),
    ("Admin", "Published product review visible on PDP", "Sign-off", "P1", "Reviews admin access", "New or edited avis",
     "Publish review open product on storefront", "Review appears on PDP"),
    ("Admin", "Contact submission visible in messages-contact", "Sign-off", "P1", "Contact sign-off done", "Test inquiry",
     "Open admin messages-contact find latest submission", "Inquiry stored for team"),
    ("Admin", "Order status update saves and displays", "Sign-off", "P1", "Test order in admin", "Status change",
     "Change order status reload detail", "Status persisted correctly"),
    ("Admin", "COD CMI toggles in settings reflect checkout", "Sign-off", "P1", "Settings admin access", "Enable disable toggle",
     "Toggle payment method reload checkout options", "Storefront payment options match admin"),

    ("Admin", "Wrong password cannot access backoffice", "Negative", "P1", "Admin login", "Bad password",
     "Login with wrong credentials", "Access denied no data leak"),
    ("Admin", "Limited role cannot access restricted modules", "Negative", "P2", "Limited role account", "Restricted user",
     "Login attempt orders or settings outside role", "Permissions enforced"),
]


def build_rows():
    module_rank = {m: i for i, m in enumerate(MODULE_ORDER)}
    type_rank = {t: i for i, t in enumerate(TYPE_ORDER)}
    ordered = sorted(
        enumerate(CASES),
        key=lambda item: (
            module_rank.get(item[1][0], 99),
            type_rank.get(item[1][2], 99),
            item[0],
        ),
    )
    rows = []
    for n, (_, case) in enumerate(ordered, start=1):
        module, title, type_test, prio, prereq, data, steps, expected = case[:8]
        auto = case[8] if len(case) > 8 else "No"
        rows.append({
            "TC_ID": f"TC-MAN-{n:03d}",
            "Module": module,
            "Cas_manuel_recette": title,
            "Type_test": type_test,
            "Priorite": prio,
            "Prerequis": prereq,
            "Donnees_test": data,
            "Etapes": steps,
            "Resultat_attendu": expected,
            "Resultat_obtenu": "",
            "Date_execution": "",
            "Executant": "QA",
            "Environnement": "staging",
            "Automatise": auto,
        })
    return rows


out = Path(__file__).resolve().parents[1] / "docs" / "spreadsheets" / "manual-catalog.csv"
rows = build_rows()
with out.open("w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=HEADER)
    w.writeheader()
    w.writerows(rows)

types = Counter(r["Type_test"] for r in rows)
modules = Counter(r["Module"] for r in rows)
print(f"Wrote {len(rows)} rows to {out}")
for t, c in sorted(types.items()):
    print(f"  {t}: {c}")
print("Modules:")
for m in MODULE_ORDER:
    if modules.get(m):
        print(f"  {m}: {modules[m]}")
