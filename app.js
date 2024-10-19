const resultContainer = document.getElementById('result');
const button = document.getElementById('generate');
let result = null;

function enableButton(){
      button.disabled = false;
}

async function init(){
      const template = await fetch('./template.tex')
          .then(response => response.text())

      const engine = new PdfTeXEngine();
      await engine.loadEngine();
      engine.writeMemFSFile("main.tex", template);
      engine.setEngineMainFile("main.tex");
      result = await engine.compileLaTeX();
      console.log(result.log);
      button.addEventListener('click', () => generate())
}

async function generate() {
      if(button.disabled) {
            console.log("Engine not ready yet");
            return;
      }
      button.disabled = true;

      if (result.status === 0) {
            const pdfblob = new Blob([result.pdf], {type : 'application/pdf'});
            const objectURL = URL.createObjectURL(pdfblob);
            console.log(objectURL);
            resultContainer.innerHTML = `<embed src="${objectURL}" width="100%" height="400px" type="application/pdf">`;
      }
}

init().then(enableButton);