import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const terserPlugin = terser({
  format: {
    comments: false,
  },
});

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.cjs.cjs',
        format: 'cjs',
      },
      {
        file: 'lib/index.cjs.min.cjs',
        format: 'cjs',
        plugins: [terserPlugin],
      },
      {
        file: 'lib/index.es.mjs',
        format: 'es',
      },
      {
        file: 'lib/index.es.min.mjs',
        format: 'es',
        plugins: [terserPlugin],
      },
      {
        file: 'lib/index.umd.js',
        format: 'umd',
        name: 'Tablab',
      },
      {
        file: 'lib/index.umd.min.js',
        format: 'umd',
        name: 'Tablab',
        plugins: [terserPlugin],
      },
      {
        file: 'lib/index.global.js',
        format: 'iife',
        name: 'Tablab',
      },
      {
        file: 'lib/index.global.min.js',
        format: 'iife',
        name: 'Tablab',
        plugins: [terserPlugin],
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
  },
  {
    input: 'lib/index.d.ts',
    output: [{ file: 'lib/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
