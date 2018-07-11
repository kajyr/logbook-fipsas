import * as fs from 'fs-extra';
import * as Mustache from 'mustache';
import * as path from 'path';
import { apply, copy } from './fs';
import { ILogbook } from './logbook';

const buildHtml = (
  templateDir: string,
  logbook: ILogbook,
  images,
  dest: string,
) => {
  return fs
    .readFile(path.join(templateDir, 'index.mustache'), 'utf8')
    .then((template) => Mustache.render(template, { logbook, images }))
    .then((html) => fs.writeFile(path.join(dest, 'index.html'), html));
};

const copyTemplateFiles = (templateDir: string, dest: string) =>
  Promise.all([
    apply(path.join(templateDir, 'imgs', '*.png'), (file: string) =>
      copy(file, dest),
    ),
    apply(path.join(templateDir, '*.css'), (file: string) => copy(file, dest)),
  ]);

const build = (templateDir: string, logbook: ILogbook, dest: string) => {
  return copyTemplateFiles(templateDir, dest)
    .then((images) => buildHtml(templateDir, logbook, images, dest))

    .then(() => dest);
};

export default build;
