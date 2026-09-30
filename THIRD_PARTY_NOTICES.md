# Third-party notices

## COSS UI registry components

This project uses COSS UI source from [cosscom/coss](https://github.com/cosscom/coss), maintained by coss.com and its contributors.

**Pinned revision:** `59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e`.

**Source scope:** `apps/ui/registry/default/ui/` (Button, Card, Badge and Spinner), `apps/ui/registry/default/lib/utils.ts`, and `apps/ui` style/font registry definitions. The published JSON registry items carry those source files. Local copies adapt module import paths for this application; project-specific composition is maintained separately.

**License:** MIT. Upstream's [LICENSING.md](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/LICENSING.md) explicitly places `apps/ui/` and its subdirectories under MIT. This is also declared by [apps/ui/package.json](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/package.json) and the [UI README](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/README.md). The registry items contain no separate license field. The repository's root default and its separate `packages/ui` workspace have a different license; the sources identified here are from the MIT `apps/ui` registry.

### Source references

- [Button](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/default/ui/button.tsx)
- [Card](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/default/ui/card.tsx)
- [Badge](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/default/ui/badge.tsx)
- [Spinner](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/default/ui/spinner.tsx)
- [Class-name utility](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/default/lib/utils.ts)
- [Style tokens](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/registry-styles.ts)
- [Font registry](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/registry-fonts.ts)

### MIT notice

The upstream repository's MIT notice is retained below verbatim, including its original Origin UI attribution. The notice text is published at [apps/origin/LICENSE.md](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/origin/LICENSE.md); the applicability of MIT to the COSS `apps/ui` sources is established by the scope declarations above.

```text
MIT License

Copyright (c) 2025 coss.com
Originally Copyright (c) 2025 Origin UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Dependencies and fonts

### Header theme icon

The header uses `Moon02Icon` and `Sun03Icon` from `@hugeicons/core-free-icons@2.0.0`, rendered with `@hugeicons/react@1.1.10`. Both packages declare the MIT license. The renderer ships the Hugeicons MIT notice below; the icon pack declares MIT in its package metadata. This is the icon family used by the pinned [COSS ModeSwitcher](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/packages/ui/src/shared/mode-switcher.tsx); the local icons represent each selected preference using the same size and stroke width. System mode uses `ContrastIcon` from the existing `lucide-react` dependency, which retains its upstream ISC license. The local three-mode cycling logic is project-specific. No shared AGPL component source is vendored.

- [Hugeicons free icon package](https://www.npmjs.com/package/@hugeicons/core-free-icons/v/2.0.0)
- [Hugeicons React renderer](https://www.npmjs.com/package/@hugeicons/react/v/1.1.10)

```text
MIT License

Copyright (c) 2025 Hugeicons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Third-party packages and font files retain their own upstream licenses. Their exact versions are recorded in `package-lock.json`; any vendored font license files are retained with the font assets. The project's existing [MIT license](LICENSE) remains unchanged.
