const { compile } = require("@tailwindcss/node");
const { Scanner } = require("@tailwindcss/oxide");
const fs = require("fs");
const path = require("path");

async function buildCss() {
  const rootDir = process.cwd();
  const inputCssPath = path.join(rootDir, "node_modules", "tailwindcss", "index.css");
  const inputCss = fs.readFileSync(inputCssPath, "utf-8");

  const compiler = await compile(inputCss, {
    base: rootDir,
    from: path.join(rootDir, "app", "globals.css"),
  });

  const scanner = new Scanner({
    sources: [
      {
        base: rootDir,
        pattern: "app/**/*.{ts,tsx,js,jsx}",
        negated: false,
      },
    ],
  });

  const candidates = Array.from(scanner.scan());
  const builtCss = compiler.build(candidates);

  const finalCss = `/* Auto-generated Tailwind CSS build */
${builtCss}

/* Additional Custom Utilities */
html {
  scroll-behavior: smooth;
}

body {
  background-color: #FFFBFB;
  color: #1F2937;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

  const outputPath = path.join(rootDir, "app", "globals.css");
  fs.writeFileSync(outputPath, finalCss, "utf-8");
  console.log(`Successfully compiled Tailwind CSS to app/globals.css (${Math.round(finalCss.length / 1024)} KB, ${candidates.length} classes scanned)`);
}

buildCss().catch((err) => {
  console.error("CSS Build Error:", err);
  process.exit(1);
});

