import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
// import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import external from 'rollup-plugin-peer-deps-external'
import dts from 'rollup-plugin-dts'
import babel from '@rollup/plugin-babel'
import cssnano from 'cssnano'
import nested from 'postcss-nested'
import { packageJson } from './load-config.cjs'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        name: 'reactAnyRender',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      babel({
        babelHelpers: 'runtime',
        // runtimeHelpers: true,
        exclude: '**/node_modules/**',
        // extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      postcss({
        use: [
          [
            'less',
            {
              javascriptEnabled: true,
            },
          ],
        ],
        plugins: [nested(), cssnano()],
        extensions: ['.css', '.less'],
        extract: false,
      }),
      // terser(),
    ],
  },
  {
    input: 'dist/es/types/index.d.ts',
    output: [{ file: 'dist/lib/index.d.ts', format: 'esm' }],
    external: [/\.css$/],
    plugins: [dts()],
  },
]
