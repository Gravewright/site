import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {packageExamples} from '../content/examples-packages.mjs';
import {surfaceExamplePackages} from '../content/examples-surfaces.mjs';
import {tutorialPackages,distributionSupportFiles} from '../content/tutorials.mjs';
import {sourceArchive} from './example-archive.mjs';

export async function buildExamples(root){
  const license=await readFile(resolve(root,'LICENSE'));
  for(const example of packageExamples){
    const base=resolve(root,'assets/examples/packages',example.id);
    const readme='# '+example.manifest.name+'\n\n'+example.en.goal+'\n\n'+example.pt.goal+'\n\nTarget host: Gravewright 0.3.0; SDK 1.0.0.\nUnsigned sources: review, then use Install from ZIP on a disposable host. Marketplace publication requires the documented publisher signature.\nFontes sem assinatura: revise e use Instalar de ZIP em host descartável. Publicação no Marketplace requer a assinatura documentada do publicador.\n\nDocumentation: https://gravewright.com/docs/en/'+example.slug+'.html\nPortuguês: https://gravewright.com/docs/pt-BR/'+example.slug+'.html\n';
    const files={'manifest.json':JSON.stringify(example.manifest,null,2)+'\n',...example.files,'LICENSE.txt':license,'README.md':readme};
    for(const [file,bytes] of Object.entries(files)){
      await mkdir(dirname(resolve(base,file)),{recursive:true});
      await writeFile(resolve(base,file),bytes);
    }
    await writeFile(resolve(base,example.id+'-source.zip'),sourceArchive(files));
  }
  for(const example of surfaceExamplePackages){
    const base=resolve(root,'assets/examples/surfaces',example.directory),files=example.files;
    await mkdir(base,{recursive:true});
    for(const [name,bytes] of Object.entries(files)) await writeFile(resolve(base,name),bytes);
    await writeFile(resolve(base,example.directory+'-source.zip'),sourceArchive(files));
  }
  const blueprints=resolve(root,'assets/examples/blueprints');
  for(const tutorial of tutorialPackages){
    const base=resolve(root,'assets/tutorials',tutorial.id);
    const files={...tutorial.files,'manifest.json':JSON.stringify(tutorial.manifest,null,2)+'\n'};
    if(!files['LICENSE.txt']) files['LICENSE.txt']=license;
    for(const [name,bytes] of Object.entries(files)){
      await mkdir(dirname(resolve(base,name)),{recursive:true});
      await writeFile(resolve(base,name),bytes);
    }
    await writeFile(resolve(base,tutorial.id+'-source.zip'),sourceArchive(files));
  }
  for(const support of distributionSupportFiles){
    await mkdir(dirname(resolve(root,support.path)),{recursive:true});
    await writeFile(resolve(root,support.path),support.content);
  }
  await writeFile(resolve(blueprints,'LICENSE.txt'),license);
  async function collect(directory,prefix=''){
    const files={};
    for(const item of await readdir(directory,{withFileTypes:true})){
      const name=prefix+item.name;
      if(item.isDirectory()) Object.assign(files,await collect(resolve(directory,item.name),name+'/'));
      else if(item.isFile()&&!item.name.endsWith('.zip')) files[name]=await readFile(resolve(directory,item.name));
    }
    return files;
  }
  await writeFile(resolve(blueprints,'examples.zip'),sourceArchive(await collect(blueprints)));
  console.log('Generated '+packageExamples.length+' example packages, '+surfaceExamplePackages.length+' surface ZIPs, '+tutorialPackages.length+' tutorial projects and the blueprint bundle.');
}
