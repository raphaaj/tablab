# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0-alpha.5](https://github.com/raphael-jorge/tablab/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2022-03-18)


### Features

* **instruction-writers:** set the parsedInstruction field to be required ([#127](https://github.com/raphael-jorge/tablab/issues/127)) ([7217898](https://github.com/raphael-jorge/tablab/commit/7217898a30ce02ba499ea0efadf04060db97a8b8))


### Docs

* add ci status badge on README ([1975d51](https://github.com/raphael-jorge/tablab/commit/1975d51f4fdaa57f1b6d17ee8d0dc29b02436953))

## [1.0.0-alpha.4](https://github.com/raphael-jorge/tablab/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2022-03-13)


### Features

* allow the descriptions of invalid instructions to be regenerated ([291320b](https://github.com/raphael-jorge/tablab/commit/291320b61290e966672234025a86ea5b3506f488))
* **instructions:** setup i18n on descriptions of invalid instructions ([de140b1](https://github.com/raphael-jorge/tablab/commit/de140b1720752fcde0fc5336f59fb91b257137f2))
* store the write results of the repeat instruction targets as child results ([12add83](https://github.com/raphael-jorge/tablab/commit/12add83f21e3fb6b2f02173fec858866c03f44d8))
* **write-results:** allow the write results to have child results ([3fef686](https://github.com/raphael-jorge/tablab/commit/3fef686747a47e2332907a5668ffee77b89b3b2d))


### Bug Fixes

* consider a method instruction with no arguments between the enclosures to be without arguments ([457fbd9](https://github.com/raphael-jorge/tablab/commit/457fbd981eda8f2c930f903dd4eabca026b7ff11))
* correct the description for invalid merge instructions without targets ([9a8426b](https://github.com/raphael-jorge/tablab/commit/9a8426b2223140a02453fbd70298bb8bba1aa61c))
* set repeat instructions with a decimal number of repetitions to be invalid ([316082c](https://github.com/raphael-jorge/tablab/commit/316082cefcb3bfeee4068f609db2ba831a326ee7))
* set spacing instructions with a decimal number of spacing to be invalid ([869e7bc](https://github.com/raphael-jorge/tablab/commit/869e7bc6b2df4b1dc09d63a4dd2148c4dcca3943))


### Build Operations

* **deps-dev:** bump @types/jest from 27.4.0 to 27.4.1 ([#108](https://github.com/raphael-jorge/tablab/issues/108)) ([03efda2](https://github.com/raphael-jorge/tablab/commit/03efda2723edfd907d113afae1885afd7eb88550))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#102](https://github.com/raphael-jorge/tablab/issues/102)) ([5ce7abb](https://github.com/raphael-jorge/tablab/commit/5ce7abbd41bb05d0cd31190d428f4bee7052145c))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#106](https://github.com/raphael-jorge/tablab/issues/106)) ([fac903e](https://github.com/raphael-jorge/tablab/commit/fac903e4a11cdd4be8b887085395631305cd2436))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#110](https://github.com/raphael-jorge/tablab/issues/110)) ([781f8f7](https://github.com/raphael-jorge/tablab/commit/781f8f797d4dd774b58e0b2c91415e8b5ac0070a))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#121](https://github.com/raphael-jorge/tablab/issues/121)) ([91e39ab](https://github.com/raphael-jorge/tablab/commit/91e39ab33bb0434b636ba7e48a580f3dea684811))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#85](https://github.com/raphael-jorge/tablab/issues/85)) ([7bbe219](https://github.com/raphael-jorge/tablab/commit/7bbe219954735e37aa67c59d2a89651450e921ce))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#89](https://github.com/raphael-jorge/tablab/issues/89)) ([9e1d0c1](https://github.com/raphael-jorge/tablab/commit/9e1d0c154e25e0c39057e3699fb8103e4d8b9be8))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#97](https://github.com/raphael-jorge/tablab/issues/97)) ([f6a7368](https://github.com/raphael-jorge/tablab/commit/f6a73681c5c3e4c9833d9e88df55240737502cf0))
* **deps-dev:** bump @typescript-eslint/parser from 5.10.0 to 5.10.1 ([#86](https://github.com/raphael-jorge/tablab/issues/86)) ([10fa534](https://github.com/raphael-jorge/tablab/commit/10fa534c5f4f6c7f337d8ef468350f68e4819e34))
* **deps-dev:** bump @typescript-eslint/parser from 5.10.1 to 5.10.2 ([#90](https://github.com/raphael-jorge/tablab/issues/90)) ([a163636](https://github.com/raphael-jorge/tablab/commit/a163636592286d84b12eab5cfa88b6c10f3fa403))
* **deps-dev:** bump @typescript-eslint/parser from 5.10.2 to 5.11.0 ([#96](https://github.com/raphael-jorge/tablab/issues/96)) ([4f033d9](https://github.com/raphael-jorge/tablab/commit/4f033d98a97461b018c7a716f0beeb3b50b1a265))
* **deps-dev:** bump @typescript-eslint/parser from 5.11.0 to 5.12.0 ([#101](https://github.com/raphael-jorge/tablab/issues/101)) ([9fe8e57](https://github.com/raphael-jorge/tablab/commit/9fe8e57e4a3d631dd9d0c6767d0b81990bf4319e))
* **deps-dev:** bump @typescript-eslint/parser from 5.12.0 to 5.12.1 ([#105](https://github.com/raphael-jorge/tablab/issues/105)) ([853c1ca](https://github.com/raphael-jorge/tablab/commit/853c1ca8fe4d27560894aed2f74f58897563a6aa))
* **deps-dev:** bump @typescript-eslint/parser from 5.12.1 to 5.13.0 ([#111](https://github.com/raphael-jorge/tablab/issues/111)) ([750b9a5](https://github.com/raphael-jorge/tablab/commit/750b9a5d4868f59c355e1cdff0ecfe8aa076fc95))
* **deps-dev:** bump @typescript-eslint/parser from 5.13.0 to 5.14.0 ([#119](https://github.com/raphael-jorge/tablab/issues/119)) ([0be80df](https://github.com/raphael-jorge/tablab/commit/0be80dfee77a6a48873b3e511434c07799afae47))
* **deps-dev:** bump eslint from 8.7.0 to 8.8.0 ([#88](https://github.com/raphael-jorge/tablab/issues/88)) ([f2cc7d1](https://github.com/raphael-jorge/tablab/commit/f2cc7d1dc22e21860257cf851613c27caf7c661d))
* **deps-dev:** bump eslint from 8.8.0 to 8.9.0 ([#100](https://github.com/raphael-jorge/tablab/issues/100)) ([e6fe99a](https://github.com/raphael-jorge/tablab/commit/e6fe99ad4cd14affa0a0ac7fdb59fdb1936452d6))
* **deps-dev:** bump eslint from 8.9.0 to 8.10.0 ([#109](https://github.com/raphael-jorge/tablab/issues/109)) ([fcfb0dc](https://github.com/raphael-jorge/tablab/commit/fcfb0dc8a28965c8743d8b0bdcbddfcc27866522))
* **deps-dev:** bump eslint-config-prettier from 8.3.0 to 8.4.0 ([#103](https://github.com/raphael-jorge/tablab/issues/103)) ([686c8a5](https://github.com/raphael-jorge/tablab/commit/686c8a509efb46decbe803eec98925a86861932a))
* **deps-dev:** bump eslint-config-prettier from 8.4.0 to 8.5.0 ([#115](https://github.com/raphael-jorge/tablab/issues/115)) ([1e84f68](https://github.com/raphael-jorge/tablab/commit/1e84f686c4f6f1d5c1c47b2260db17a0772988cb))
* **deps-dev:** bump jest from 27.4.7 to 27.5.0 ([#93](https://github.com/raphael-jorge/tablab/issues/93)) ([54b4f48](https://github.com/raphael-jorge/tablab/commit/54b4f4825be65a58b5c1dbcd4690462405551c20))
* **deps-dev:** bump jest from 27.5.0 to 27.5.1 ([#98](https://github.com/raphael-jorge/tablab/issues/98)) ([b7773f5](https://github.com/raphael-jorge/tablab/commit/b7773f5851609d54308291918831209abc7d4ba2))
* **deps-dev:** bump rollup from 2.64.0 to 2.66.0 ([#84](https://github.com/raphael-jorge/tablab/issues/84)) ([5a57b8f](https://github.com/raphael-jorge/tablab/commit/5a57b8f434ea53b6c64748f4209baba5fe2b26bd))
* **deps-dev:** bump rollup from 2.66.0 to 2.66.1 ([#87](https://github.com/raphael-jorge/tablab/issues/87)) ([12ffe24](https://github.com/raphael-jorge/tablab/commit/12ffe24c5aef810376e20561d8524434c5b361ef))
* **deps-dev:** bump rollup from 2.66.1 to 2.67.0 ([#92](https://github.com/raphael-jorge/tablab/issues/92)) ([3a592ab](https://github.com/raphael-jorge/tablab/commit/3a592ab7d42f03d3fa89f821846b935279d0bdf4))
* **deps-dev:** bump rollup from 2.67.0 to 2.67.1 ([#95](https://github.com/raphael-jorge/tablab/issues/95)) ([2040be5](https://github.com/raphael-jorge/tablab/commit/2040be57f7c1bbe988df91e2f2f02b5a5dcc19c8))
* **deps-dev:** bump rollup from 2.67.1 to 2.67.2 ([#99](https://github.com/raphael-jorge/tablab/issues/99)) ([3d4a6e1](https://github.com/raphael-jorge/tablab/commit/3d4a6e1d8ab3d5d714171d6c2f9c1e3316178b25))
* **deps-dev:** bump rollup from 2.67.2 to 2.67.3 ([#104](https://github.com/raphael-jorge/tablab/issues/104)) ([51f79e4](https://github.com/raphael-jorge/tablab/commit/51f79e4313addb1d02bf0dec8ed96892cb88b6c0))
* **deps-dev:** bump rollup from 2.67.3 to 2.68.0 ([#107](https://github.com/raphael-jorge/tablab/issues/107)) ([9cc73a2](https://github.com/raphael-jorge/tablab/commit/9cc73a2b5885780f83eba44e3655dd8c9dc1d7b3))
* **deps-dev:** bump rollup from 2.68.0 to 2.69.0 ([#114](https://github.com/raphael-jorge/tablab/issues/114)) ([2e156f1](https://github.com/raphael-jorge/tablab/commit/2e156f1199bbd0683c00aa894e83722f6fc33caf))
* **deps-dev:** bump rollup from 2.69.0 to 2.69.2 ([#118](https://github.com/raphael-jorge/tablab/issues/118)) ([7d3752e](https://github.com/raphael-jorge/tablab/commit/7d3752ef69bd2ae5aa75eb48e6100a087625cbcf))
* **deps-dev:** bump rollup from 2.69.2 to 2.70.0 ([#120](https://github.com/raphael-jorge/tablab/issues/120)) ([430394e](https://github.com/raphael-jorge/tablab/commit/430394e079d095255b8b8de25347bc0f69eaa77e))
* **deps-dev:** bump rollup-plugin-dts from 4.1.0 to 4.2.0 ([#116](https://github.com/raphael-jorge/tablab/issues/116)) ([138e8c9](https://github.com/raphael-jorge/tablab/commit/138e8c97a260c7a070f607e89171bd7f1061385f))
* **deps-dev:** bump rollup-plugin-typescript2 from 0.31.1 to 0.31.2 ([#91](https://github.com/raphael-jorge/tablab/issues/91)) ([aaa435a](https://github.com/raphael-jorge/tablab/commit/aaa435acab3044123d1ed84b81bb47795c524f4e))
* **deps-dev:** bump ts-node from 10.4.0 to 10.5.0 ([#94](https://github.com/raphael-jorge/tablab/issues/94)) ([5a5054c](https://github.com/raphael-jorge/tablab/commit/5a5054cecc29d2b644ce99d1bc39b043bd8a5465))
* **deps-dev:** bump ts-node from 10.5.0 to 10.6.0 ([#113](https://github.com/raphael-jorge/tablab/issues/113)) ([db808bf](https://github.com/raphael-jorge/tablab/commit/db808bfead3166519d8b87ceaa8acfc9723a16f4))
* **deps-dev:** bump ts-node from 10.6.0 to 10.7.0 ([#117](https://github.com/raphael-jorge/tablab/issues/117)) ([82049cd](https://github.com/raphael-jorge/tablab/commit/82049cd947f90bbc67eb50c06b1da914ee69290d))
* **deps-dev:** bump typescript from 4.5.5 to 4.6.2 ([#112](https://github.com/raphael-jorge/tablab/issues/112)) ([b5606a0](https://github.com/raphael-jorge/tablab/commit/b5606a07d15c5aa87a0d7ad8fd30573331cc5bfa))


### Code Refactoring

* move all exports to the root index.ts ([178c7f6](https://github.com/raphael-jorge/tablab/commit/178c7f6d64e5c110bf19551af712b5d53a8d2bd6))

## [1.0.0-alpha.3](https://github.com/raphael-jorge/tablab/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2022-01-23)


### Bug Fixes

* **instructions:** fix the repeat instruction write result for scenarios with invalid instructions ([#83](https://github.com/raphael-jorge/tablab/issues/83)) ([dac7644](https://github.com/raphael-jorge/tablab/commit/dac76444da6692d0bcd2118f4f2105298cca3b62))


### Continuous Integrations

* add coveralls integration ([3908da1](https://github.com/raphael-jorge/tablab/commit/3908da1238fb547c3d385f867dc187476b5658d4))
* setup github ci action ([a5da4b3](https://github.com/raphael-jorge/tablab/commit/a5da4b3bc2c7020709e8a391c30a0fcb218d407f))
* setup github ci action to auto merge dependabot's pr ([8961ed8](https://github.com/raphael-jorge/tablab/commit/8961ed85bb7ce77767a0abd6d3b586ef2017628f))
* setup github ci action to lint commit messages ([adb49e5](https://github.com/raphael-jorge/tablab/commit/adb49e555a02fef902b0fea2816faf5bf06a698f))


### Build Operations

* **deps-dev:** bump @types/jest from 27.0.1 to 27.0.2 ([#17](https://github.com/raphael-jorge/tablab/issues/17)) ([33ed7f1](https://github.com/raphael-jorge/tablab/commit/33ed7f15fc10df0af8eee8c0a5400cf1c9138e41))
* **deps-dev:** bump @types/jest from 27.0.2 to 27.0.3 ([#46](https://github.com/raphael-jorge/tablab/issues/46)) ([b024377](https://github.com/raphael-jorge/tablab/commit/b024377b3ee440096e4a0b22182623f8a5e2befc))
* **deps-dev:** bump @types/jest from 27.0.3 to 27.4.0 ([#70](https://github.com/raphael-jorge/tablab/issues/70)) ([71efd25](https://github.com/raphael-jorge/tablab/commit/71efd254530fbacd82e0dc733d4876fc40b145a8))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#12](https://github.com/raphael-jorge/tablab/issues/12)) ([67dfe95](https://github.com/raphael-jorge/tablab/commit/67dfe95cf09e94e54b4609e24449edb1c0780d26))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#22](https://github.com/raphael-jorge/tablab/issues/22)) ([30cd281](https://github.com/raphael-jorge/tablab/commit/30cd2811dd621adafa50166e5f71bc28275c1785))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#24](https://github.com/raphael-jorge/tablab/issues/24)) ([6c53fdc](https://github.com/raphael-jorge/tablab/commit/6c53fdce52a8b7597176bb3cd79bbd9988533208))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#75](https://github.com/raphael-jorge/tablab/issues/75)) ([db3c02e](https://github.com/raphael-jorge/tablab/commit/db3c02e3ceef8350402ba5d6e62f001d78099188))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([#80](https://github.com/raphael-jorge/tablab/issues/80)) ([9b58ee5](https://github.com/raphael-jorge/tablab/commit/9b58ee58aa975a3a5431e94fab24855c17c50b4a))
* **deps-dev:** bump @typescript-eslint/parser from 4.31.0 to 4.31.1 ([#14](https://github.com/raphael-jorge/tablab/issues/14)) ([29b560d](https://github.com/raphael-jorge/tablab/commit/29b560da4125840d45c54e46b9b84083adae4249))
* **deps-dev:** bump @typescript-eslint/parser from 4.31.1 to 4.32.0 ([#23](https://github.com/raphael-jorge/tablab/issues/23)) ([132b40f](https://github.com/raphael-jorge/tablab/commit/132b40fa5d9616090b9f0fae957a7a8b007d7249))
* **deps-dev:** bump @typescript-eslint/parser from 4.32.0 to 4.33.0 ([#25](https://github.com/raphael-jorge/tablab/issues/25)) ([ab6fdf0](https://github.com/raphael-jorge/tablab/commit/ab6fdf07c8d8fb6085952f6019373a2b5121f6ce))
* **deps-dev:** bump @typescript-eslint/parser from 5.9.0 to 5.9.1 ([#76](https://github.com/raphael-jorge/tablab/issues/76)) ([da1d684](https://github.com/raphael-jorge/tablab/commit/da1d684cbbc10d8e9e85d52c906655daa2c98455))
* **deps-dev:** bump @typescript-eslint/parser from 5.9.1 to 5.10.0 ([#81](https://github.com/raphael-jorge/tablab/issues/81)) ([ec20e73](https://github.com/raphael-jorge/tablab/commit/ec20e730f76c5b7f98770c53b3d15d9dc58c7e8e))
* **deps-dev:** bump eslint from 7.32.0 to 8.6.0 ([#71](https://github.com/raphael-jorge/tablab/issues/71)) ([96afb77](https://github.com/raphael-jorge/tablab/commit/96afb772d6c4ae0af35f288e6cd4c215ec0700c5))
* **deps-dev:** bump eslint from 8.6.0 to 8.7.0 ([#78](https://github.com/raphael-jorge/tablab/issues/78)) ([1b13e00](https://github.com/raphael-jorge/tablab/commit/1b13e0089f8d706be6391761d281aa2eed580a59))
* **deps-dev:** bump jest from 27.1.1 to 27.2.0 ([#13](https://github.com/raphael-jorge/tablab/issues/13)) ([3ef1ced](https://github.com/raphael-jorge/tablab/commit/3ef1ced3b732e33b2f845f8da008aa2cc57de989))
* **deps-dev:** bump jest from 27.2.0 to 27.2.1 ([#18](https://github.com/raphael-jorge/tablab/issues/18)) ([18bf6a6](https://github.com/raphael-jorge/tablab/commit/18bf6a63228fb0f02d703196bbd51efe12091b0c))
* **deps-dev:** bump jest from 27.2.1 to 27.2.4 ([#21](https://github.com/raphael-jorge/tablab/issues/21)) ([29aefe0](https://github.com/raphael-jorge/tablab/commit/29aefe0c34dcb7af63ee968e571fefc37a61b928))
* **deps-dev:** bump jest from 27.2.4 to 27.2.5 ([#26](https://github.com/raphael-jorge/tablab/issues/26)) ([91bff7b](https://github.com/raphael-jorge/tablab/commit/91bff7b3303a5b36fee720000e53509028e7458b))
* **deps-dev:** bump jest from 27.2.5 to 27.3.0 ([#32](https://github.com/raphael-jorge/tablab/issues/32)) ([7a20655](https://github.com/raphael-jorge/tablab/commit/7a20655c12ffb8b87511ba37353aa10c7430808a))
* **deps-dev:** bump jest from 27.3.0 to 27.3.1 ([#35](https://github.com/raphael-jorge/tablab/issues/35)) ([773794a](https://github.com/raphael-jorge/tablab/commit/773794a6c8c317912c8b1df0d16ac6e287e1ba3e))
* **deps-dev:** bump jest from 27.3.1 to 27.4.0 ([#51](https://github.com/raphael-jorge/tablab/issues/51)) ([b92b237](https://github.com/raphael-jorge/tablab/commit/b92b237a752109c6e9205be68ef6535bce2d62d6))
* **deps-dev:** bump jest from 27.4.0 to 27.4.2 ([#52](https://github.com/raphael-jorge/tablab/issues/52)) ([8efae85](https://github.com/raphael-jorge/tablab/commit/8efae857cc3a6f02aa9fcd3e93a9e81aff68ed66))
* **deps-dev:** bump jest from 27.4.2 to 27.4.3 ([#54](https://github.com/raphael-jorge/tablab/issues/54)) ([788a2b1](https://github.com/raphael-jorge/tablab/commit/788a2b1ee9c1547a8ca033e866a662271622b25e))
* **deps-dev:** bump jest from 27.4.3 to 27.4.4 ([#62](https://github.com/raphael-jorge/tablab/issues/62)) ([9f8e6cc](https://github.com/raphael-jorge/tablab/commit/9f8e6ccd7d951167c8a9bdcefa3d0b7d52f9e8ea))
* **deps-dev:** bump jest from 27.4.4 to 27.4.5 ([#65](https://github.com/raphael-jorge/tablab/issues/65)) ([3b0c107](https://github.com/raphael-jorge/tablab/commit/3b0c107287414ee65ebf15c42ffb33fc5634b7fd))
* **deps-dev:** bump jest from 27.4.5 to 27.4.6 ([#73](https://github.com/raphael-jorge/tablab/issues/73)) ([fccadfe](https://github.com/raphael-jorge/tablab/commit/fccadfe798c55f8f9c3b6fe6476fa53b00c239b7))
* **deps-dev:** bump jest from 27.4.6 to 27.4.7 ([#74](https://github.com/raphael-jorge/tablab/issues/74)) ([2622c12](https://github.com/raphael-jorge/tablab/commit/2622c1209001dd2b1144e7aa893f817c75d601db))
* **deps-dev:** bump prettier from 2.2.1 to 2.4.1 ([#33](https://github.com/raphael-jorge/tablab/issues/33)) ([a53c072](https://github.com/raphael-jorge/tablab/commit/a53c0728b04b9f9e5eecd739e4f3b332039c65d6))
* **deps-dev:** bump prettier from 2.4.1 to 2.5.0 ([#50](https://github.com/raphael-jorge/tablab/issues/50)) ([2448377](https://github.com/raphael-jorge/tablab/commit/24483770210708a87d9c92fd86867d780e0cd94d))
* **deps-dev:** bump prettier from 2.5.0 to 2.5.1 ([#56](https://github.com/raphael-jorge/tablab/issues/56)) ([31b1852](https://github.com/raphael-jorge/tablab/commit/31b1852f76392788f55a0997a1dc6d0956013515))
* **deps-dev:** bump rollup from 2.56.3 to 2.57.0 ([#19](https://github.com/raphael-jorge/tablab/issues/19)) ([f9f744a](https://github.com/raphael-jorge/tablab/commit/f9f744aa2bfe8c8d7a97b23516e028b0d92777fb))
* **deps-dev:** bump rollup from 2.57.0 to 2.58.0 ([#20](https://github.com/raphael-jorge/tablab/issues/20)) ([b5cfdab](https://github.com/raphael-jorge/tablab/commit/b5cfdabe28064e9f842dd4e9725a13416d75aef3))
* **deps-dev:** bump rollup from 2.58.0 to 2.58.3 ([#39](https://github.com/raphael-jorge/tablab/issues/39)) ([b7246a0](https://github.com/raphael-jorge/tablab/commit/b7246a0dc9e2d37d92e8a8d6d63c6e2c96d37ab3))
* **deps-dev:** bump rollup from 2.58.3 to 2.59.0 ([#40](https://github.com/raphael-jorge/tablab/issues/40)) ([aaf7820](https://github.com/raphael-jorge/tablab/commit/aaf7820317acf2d0d457c70dd60c01e48a5fbb02))
* **deps-dev:** bump rollup from 2.59.0 to 2.60.0 ([#43](https://github.com/raphael-jorge/tablab/issues/43)) ([d45045c](https://github.com/raphael-jorge/tablab/commit/d45045cc845c24e0342fc20a8c8a57e3331205ab))
* **deps-dev:** bump rollup from 2.60.0 to 2.60.1 ([#48](https://github.com/raphael-jorge/tablab/issues/48)) ([f202734](https://github.com/raphael-jorge/tablab/commit/f202734d7b75461e510d3d265ee40c58a741125e))
* **deps-dev:** bump rollup from 2.60.1 to 2.60.2 ([#53](https://github.com/raphael-jorge/tablab/issues/53)) ([9da1bad](https://github.com/raphael-jorge/tablab/commit/9da1bad7786f702e05e653d3478de9bb7cf09eff))
* **deps-dev:** bump rollup from 2.60.2 to 2.61.0 ([#60](https://github.com/raphael-jorge/tablab/issues/60)) ([7566487](https://github.com/raphael-jorge/tablab/commit/7566487e3e059d84be539ae10b1a6dcdb9143ccd))
* **deps-dev:** bump rollup from 2.61.0 to 2.61.1 ([#63](https://github.com/raphael-jorge/tablab/issues/63)) ([28e38b5](https://github.com/raphael-jorge/tablab/commit/28e38b50dbdf65d67535a61c19e759c59f004679))
* **deps-dev:** bump rollup from 2.61.1 to 2.62.0 ([#68](https://github.com/raphael-jorge/tablab/issues/68)) ([2ba6d2a](https://github.com/raphael-jorge/tablab/commit/2ba6d2af434196e4d308678d2117b92120e8f425))
* **deps-dev:** bump rollup from 2.62.0 to 2.63.0 ([#72](https://github.com/raphael-jorge/tablab/issues/72)) ([0326391](https://github.com/raphael-jorge/tablab/commit/0326391a720d4fb45724c511ff9d90b0a9d1a356))
* **deps-dev:** bump rollup from 2.63.0 to 2.64.0 ([#79](https://github.com/raphael-jorge/tablab/issues/79)) ([ff77232](https://github.com/raphael-jorge/tablab/commit/ff77232815c70047b87c18c93ef35d267093bb2c))
* **deps-dev:** bump rollup-plugin-dts from 4.0.0 to 4.0.1 ([#41](https://github.com/raphael-jorge/tablab/issues/41)) ([4943e19](https://github.com/raphael-jorge/tablab/commit/4943e19e12c1f7f0c4f91bdec0ac6849d0a139b1))
* **deps-dev:** bump rollup-plugin-dts from 4.0.1 to 4.1.0 ([#69](https://github.com/raphael-jorge/tablab/issues/69)) ([9e86ae3](https://github.com/raphael-jorge/tablab/commit/9e86ae3757552288533b3ce4395fb138dcdea831))
* **deps-dev:** bump rollup-plugin-typescript2 from 0.30.0 to 0.31.0 ([#44](https://github.com/raphael-jorge/tablab/issues/44)) ([6481c16](https://github.com/raphael-jorge/tablab/commit/6481c16c21f5009c7498d19cd5be3bb847fd9179))
* **deps-dev:** bump rollup-plugin-typescript2 from 0.31.0 to 0.31.1 ([#49](https://github.com/raphael-jorge/tablab/issues/49)) ([802c225](https://github.com/raphael-jorge/tablab/commit/802c2259e2080677266171caabc1fd4681c0a226))
* **deps-dev:** bump standard-version from 9.3.1 to 9.3.2 ([#34](https://github.com/raphael-jorge/tablab/issues/34)) ([be8e104](https://github.com/raphael-jorge/tablab/commit/be8e104514d66c955e62b2e613ac515a0c9f46f0))
* **deps-dev:** bump ts-jest from 27.0.5 to 27.0.7 ([#31](https://github.com/raphael-jorge/tablab/issues/31)) ([76ac6e7](https://github.com/raphael-jorge/tablab/commit/76ac6e7c6cf1b941d20128929e5775d4be2412a1))
* **deps-dev:** bump ts-jest from 27.0.7 to 27.1.0 ([#57](https://github.com/raphael-jorge/tablab/issues/57)) ([48de28d](https://github.com/raphael-jorge/tablab/commit/48de28d3bd68a118bfaf7c28d097613f7702b06d))
* **deps-dev:** bump ts-jest from 27.1.0 to 27.1.1 ([#59](https://github.com/raphael-jorge/tablab/issues/59)) ([962fcbd](https://github.com/raphael-jorge/tablab/commit/962fcbd1f41b4ef3a632ccf2f7ade7aab06c3633))
* **deps-dev:** bump ts-jest from 27.1.1 to 27.1.2 ([#66](https://github.com/raphael-jorge/tablab/issues/66)) ([2091734](https://github.com/raphael-jorge/tablab/commit/20917340bc37485efb2c89b669bff6d0b3bbb098))
* **deps-dev:** bump ts-jest from 27.1.2 to 27.1.3 ([#77](https://github.com/raphael-jorge/tablab/issues/77)) ([4fd1593](https://github.com/raphael-jorge/tablab/commit/4fd1593ca9ba6f45c225c8c4533d5cdec2da2b2f))
* **deps-dev:** bump ts-node from 10.2.1 to 10.3.0 ([#27](https://github.com/raphael-jorge/tablab/issues/27)) ([77d7af1](https://github.com/raphael-jorge/tablab/commit/77d7af18b285d184e1651d794e9895f77a4ae8ab))
* **deps-dev:** bump ts-node from 10.3.0 to 10.3.1 ([#36](https://github.com/raphael-jorge/tablab/issues/36)) ([e2a53e1](https://github.com/raphael-jorge/tablab/commit/e2a53e1a8c3543ac778782c1f34ac163fd2a04a2))
* **deps-dev:** bump ts-node from 10.3.1 to 10.4.0 ([#37](https://github.com/raphael-jorge/tablab/issues/37)) ([e3dac34](https://github.com/raphael-jorge/tablab/commit/e3dac341f28689ce1df6066a431778276e77ea11))
* **deps-dev:** bump typescript from 4.4.3 to 4.4.4 ([#29](https://github.com/raphael-jorge/tablab/issues/29)) ([bca2157](https://github.com/raphael-jorge/tablab/commit/bca2157fc575fc7952c9cefcf4564dc926354482))
* **deps-dev:** bump typescript from 4.4.4 to 4.5.2 ([#45](https://github.com/raphael-jorge/tablab/issues/45)) ([4b6727a](https://github.com/raphael-jorge/tablab/commit/4b6727a76b9fd60b34597f31c80806488de50177))
* **deps-dev:** bump typescript from 4.5.2 to 4.5.3 ([#61](https://github.com/raphael-jorge/tablab/issues/61)) ([231aab5](https://github.com/raphael-jorge/tablab/commit/231aab53147688e063e78d17f4291bc5a657e42b))
* **deps-dev:** bump typescript from 4.5.3 to 4.5.4 ([#64](https://github.com/raphael-jorge/tablab/issues/64)) ([3f908c8](https://github.com/raphael-jorge/tablab/commit/3f908c82a13e22665bcf4f76967fb4bafcdfbd6e))
* **deps-dev:** bump typescript from 4.5.4 to 4.5.5 ([#82](https://github.com/raphael-jorge/tablab/issues/82)) ([d27297f](https://github.com/raphael-jorge/tablab/commit/d27297f18feca6f9336acf0d4d4f390f6efe6478))

## [1.0.0-alpha.2](https://github.com/raphael-jorge/tablab/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2021-09-13)

## [1.0.0-alpha.1](https://github.com/raphael-jorge/tablab/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2021-08-09)


### ⚠ BREAKING CHANGES

*   - It is not possible anymore to set a custom spacing character to be
  used at the header and footer sections of a tablature element.
  - It is not possible anymore to set a custom instructions separator
  character to be used by a parser instance.
* **instruction:** Changes in the InvalidInstructionReason enumerator:
- Members renamed:
  - UnmappedReason > UnknownReason;
  - MethodInstructionWithoutIdentifier > UnidentifiedMethodInstruction;
  - MethodInstructionWithUnmappedIdentifier > UnknownMethodInstruction;
  - WriteNoteInstructionInvalid > BasicInstructionInvalid;
  - WriteNoteInstructionWithNonWritableNote > BasicInstructionWithNonWritableNote;
  - WriteHeaderInstructionWithoutArguments > HeaderInstructionWithoutArguments;
  - WriteHeaderInstructionWithUnmappedArguments > HeaderInstructionWithUnmappedArguments;
  - WriteHeaderInstructionWithInvalidHeader > HeaderInstructionWithInvalidHeader;
  - WriteFooterInstructionWithoutArguments > FooterInstructionWithoutArguments;
  - WriteFooterInstructionWithUnmappedArguments > FooterInstructionWithUnmappedArguments;
  - WriteFooterInstructionWithInvalidFooter > FooterInstructionWithInvalidFooter;
  - SetSpacingInstructionWithoutArguments > SpacingInstructionWithoutArguments;
  - SetSpacingInstructionWithUnmappedArguments > SpacingInstructionWithUnmappedArguments;
  - SetSpacingInstructionWithInvalidSpacingValueType > SpacingInstructionWithInvalidSpacingValueType;
  - SetSpacingInstructionWithInvalidSpacingValue > SpacingInstructionWithInvalidSpacingValue;
- Member values updated.
* **parser:** Changes in the parser class:
- The field methodInstructionArgsOpeningEnclosure now becomes the
methodInstructionArgsEnclosure field, which receives a value of the
Enclosure enumerator.
- The field methodInstructionTargetsOpeningEnclosure now becomes the
methodInstructionTargetsEnclosure field, which receives a value of the
Enclosure enumerator.
- The static field DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE now
becomes the DEFAULT_METHOD_INSTRUCTION_ARGS_ENCLOSURE static field, which
has a value of the Enclosure enumerator.
- The static field DEFAULT_METHOD_INSTRUCTION_TARGETS_OPENING_ENCLOSURE
now becomes the DEFAULT_METHOD_INSTRUCTION_TARGETS_ENCLOSURE static field,
which has a value of the Enclosure enumerator.
* **tab:** Changes in the tablature element class:
- Rename field `filler` to `spacingCharacter`
- Rename filed `sectionFiller` to `sectionSpacingCharacter`
- Rename field `sectionSymbol` to `sectionDivisionCharacter`
- Rename static field `DEFAULT_FILLER` to `DEFAULT_SPACING_CHARACTER`
- Rename static field `DEFAULT_SECTION_FILLER` to `DEFAULT_SECTION_SPACING_CHARACTER`
- Rename static field `DEFAULT_SECTION_SYMBOL` to `DEFAULT_SECTION_DIVISION_CHARACTER`
- Rename method `getSectionFiller` to `getSectionSpacing`
- Rename method `getStringsFiller` to `getStringsSpacing`
* **instructions:** Move all invalid instruction reasons to the InvalidInstructionReason enumerator.
The InvalidInstructionBaseReason enumerator no longer exists.
* **tab:** Rename method `isNoteInStringsRange` at tablature elements to `isNoteWritable`
* **tab:** Rename fields at tablature elements:
- Rename static field `DEFAULT_NUMBER_OF_ROWS` at tablature elements to `DEFAULT_NUMBER_OF_STRINGS`
- Rename field `numberOfRows` at tablature elements to `numberOfStrings`
- Rename `getRowsFiller` method at tablature elements to `getStringsFiller`
- Rename `rows` field at tablature blocks to `strings`
* Rename elements in the public API and remove some
unecessary methods:

- Rename InstructionMethodData to MethodInstructionData
- Rename InstructionBuilder to MethodInstructionBuilder
- Rename instance property instructionMethodIdentifiersEnabled at
  InstructionFactoryBase to methodInstructionIdentifiersEnabled
- Rename instance property instructionMethodIdentifier2InstructionBuilderMap
  at InstructionFactoryBase to methodInstructionIdentifier2InstructionBuilderMap
- Rename InstructionMethodIdentifier to MethodInstructionIdentifier
- Rename MethodResult to ParsedMethodInstructionData. It no longer have
  the instance method named asInstructionMethodData.
- Rename ParserResult to ParsedInstructionData. It no longer have the instance
  method named asInstructionData.

### Features

* **parser:** allow parsed instructions to be written to tabs directly ([770999c](https://github.com/raphael-jorge/tablab/commit/770999c0c68df48f01e496f878d4de346df09629))
* remove not implemented options ([2d33f2e](https://github.com/raphael-jorge/tablab/commit/2d33f2ebd931ad991babfbabc9f076fd363ad2f1))
* **tab:** add a method to set a tab element spacing using the fluent API ([a894c9e](https://github.com/raphael-jorge/tablab/commit/a894c9e81315c86da1a9ebc7b296594b3a839382))


### Bug Fixes

* **tab:** fix the creation of empty blocks on formatting ([206e284](https://github.com/raphael-jorge/tablab/commit/206e28417d8506d0e582c3bc3207307424bb80d2))


### Code Refactoring

* **enclosures-helper:** update values of the Enclosure enum to reflect its keys ([cf9aacc](https://github.com/raphael-jorge/tablab/commit/cf9aacca64907ff58baf5252bdf8a751a1e0a606))
* **helpers:** remove circular dependency from string helper and enclosures helper ([e98c6e6](https://github.com/raphael-jorge/tablab/commit/e98c6e6c1e1d750b7d87a12dc5370ff41f83ca93))
* **instruction:** improve failure reasons identification and description ([ca1342c](https://github.com/raphael-jorge/tablab/commit/ca1342cf9eb0f347bd1d110b7c2ba30f69ff299d))
* **instruction:** simplify project structure ([02b6724](https://github.com/raphael-jorge/tablab/commit/02b67246b5c03330d9a82d2ee754969876e193ab))
* **instructions:** set the success property as a field at the InstructionWriteResult class ([1b3d59e](https://github.com/raphael-jorge/tablab/commit/1b3d59ea08c8b30f6a0d057f96b80eb47c536a5f))
* **instructions:** unify enumerators for invalid instruction reasons ([32769bf](https://github.com/raphael-jorge/tablab/commit/32769bf18a5f23d5e9daf50f258db8c342415aaf))
* **instructions:** update method instructions identifiers to reflect its default aliases ([ce382f0](https://github.com/raphael-jorge/tablab/commit/ce382f01290eb4438282b4aff65392c5e152bd6f))
* **parser:** rename fields of the parser to improve usability ([37f011a](https://github.com/raphael-jorge/tablab/commit/37f011a6d786a513b11fe44d310c901207fcc6f3))
* **tab:** rename fields and methods of the tablature element class to improve clarity ([0692ed1](https://github.com/raphael-jorge/tablab/commit/0692ed19195b82656832eaf978f31f04fe0c2a2e))
* **tab:** rename the method that checks if a note is writable to a tablature element ([347255d](https://github.com/raphael-jorge/tablab/commit/347255dc9f3b381cadf8066c61b6719c95ab6cd2))
* **tab:** use strings instead of rows to reference the strings section of tablature elements ([bd68c4a](https://github.com/raphael-jorge/tablab/commit/bd68c4aaf8e3d8f1140e9e4e38f5e8626e264fa0))
* uniformize names of variables and references ([30ff47b](https://github.com/raphael-jorge/tablab/commit/30ff47b76170ac34ca3810985fbb4eedf2ebde85))


### Build Operations

* add rollup bundler ([f555001](https://github.com/raphael-jorge/tablab/commit/f555001ad6ab0115a99b6459419a358765ede75a))
* update dependencies ([9a29c5b](https://github.com/raphael-jorge/tablab/commit/9a29c5b1685317c6abb2602179932c15d45594ab))

## 1.0.0-alpha.0 (2021-03-14)


### Features

* **instruction:** add instructions utilities to write tab ([b2210a4](https://github.com/raphael-jorge/tablab/commit/b2210a4448406fa905940d1bba1932f4eec36b51))
* **instruction:** add the instruction factory ([e08f4dc](https://github.com/raphael-jorge/tablab/commit/e08f4dc7bf0afaec410c3c843e08206fbee2365b))
* **parser:** add parser for instructions ([02f5b37](https://github.com/raphael-jorge/tablab/commit/02f5b3713e484217dd45ae7e51a84377de27eac3))
* **string-helper:** add function to format strings with replacers ([34645fc](https://github.com/raphael-jorge/tablab/commit/34645fca60eea7655a1905866d11585763f09e18))
* **tab:** add format functionality to tabs ([db74525](https://github.com/raphael-jorge/tablab/commit/db74525af212db62462680eaaca94212a8e6f634))
* **tab:** add tab writer ([81c72f1](https://github.com/raphael-jorge/tablab/commit/81c72f10b3cc4f6915c17067bd950a6ad3aa09bb))
* setup project dependencies ([b21c1d9](https://github.com/raphael-jorge/tablab/commit/b21c1d91c4c863894893c1dd541d2c22ff6e7456))
