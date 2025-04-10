# To create app

1. Run `npm init`, which will take you through the steps of setting up the `package.json` file.
2. Run `npm install typescript` to install typescript.
3. Run `tsc --init` which creates the `tsconfig.json` file. This contains the configuration info for typescript. Make the following updates to the `tsconfig.json` file:
   1. Under `"compilerOptions"`
      1. `"module": "none"` which tells typescript not to treat each file as a module. This will compile each typescript fill independently instead of expecting dependencies from other files.
      2. `"outFile": "ADD_RELATIVE_DESTINATION_FILE"` which specifies the file that _all_ typescript files should be transpiled into. This will create a single file containing all the transpiled javascript.
      3. Set the `"target"` attribute to the latest "ES" version, but not "ESNEXT".
   2. Add `"include"` as a sibling property to `"compilerOptions"`. For `"include"`, add an array of relative paths to folders containing typescript files to transpile. Make sure to order these paths in the order you want transpilation to occur.
      - Example: `["./scripts/components", "./scripts"]` will first transpile all `*.ts` files in the `components` folder, followed by the `*.ts` files in the `scripts` folder.
        > Combining the `"include"` array and `"outFile"` property, the transpiler will generate a JS file with the transpiled TS code in the order you want.
4. Structure your project like this:

```
|- public
| |- index.html
|- scripts
| |- components
| |  |- *.ts
| |- scripts.ts
|- styles
|  |- *.css
```

5. In the `package.json` file, add a `scripts` section that will transpile any `*.ts` files, and copies the `*.css` into the public folder. Example:

```
"scripts": {
    "build": "tsc && copy .\\styles\\styles.css .\\public"
  }
```

> NOTE: We don't need to explicitly copy the transpiled `*.js` files into the `public` folder since that is done via the `tsconfig.json > compilerOptions.outFile` property.

# Future improvments:

1. Use `nodemon` to automatically transpile `*.ts` files on save.
