import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  mindeeSubmit(evt) {
    evt.preventDefault()
    let myFileInput = document.getElementById('my-file-input') as HTMLInputElement;
    let myFile = myFileInput.files[0]
    if (!myFile) { return }
    let data = new FormData();
    data.append("document", myFile, myFile.name);

    let xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let dataJson = JSON.parse(this.responseText);
        //Linha atual na imagem
        let line = 1;
        //Coordenada Y da linha atual da imagem
        let yAxis = dataJson.document.inference.pages[0].prediction.rg.values[0].polygon[3][1];

        let filteredData = {
          name: "",
          name1: "",
          name2: "",
          date: ""
        }

        let validaData: Boolean = false;
        //Filtragem dos dados
        dataJson.document.inference.pages[0].prediction.rg.values.forEach((element, index) => {
          if (element.polygon[3][1] <= yAxis + 0.04) {
            if (line == 1) { filteredData.name += `${element.content} `; }
            if (line == 2) { filteredData.name1 += `${element.content} `; }
            if (line == 3) {
              if(validaData == true){
                if(filteredData.date == "") filteredData.date = `${element.content} `;
              }else{
                filteredData.name2 += `${element.content} `;
              }
            }
            if((line == 4) && (validaData == false)){             
              if(filteredData.date == "") filteredData.date = `${element.content} `;
            }

          } else {
            //Redefinição dos parâmetros p/ proxima linha
            if (dataJson.document.inference.pages[0].prediction.rg.values[index + 1] != null) {
              line++;
              yAxis = dataJson.document.inference.pages[0].prediction.rg.values[index + 1].polygon[3][1];

              if(line == 2){filteredData.name1 += `${element.content} `;}
              if(line == 3){
                if (['0', '1', '2', '3'].includes(element.content[0])) {
                  validaData = true;
                  if(filteredData.date == "") filteredData.date = `${element.content} `;
                }
                else {                  
                  filteredData.name2 += `${element.content} `;
                }
              }
              if((line == 4) && (validaData == false)){
                if(filteredData.date == "") filteredData.date = `${element.content} `;
              }
  
            }
          }
        });

        console.log("Nome: " + filteredData.name);
        console.log("Nome 1: " + filteredData.name1);
        console.log("Nome 2: " + filteredData.name2);
        console.log("Data de nascimento: " + filteredData.date);
      }
    });

    xhr.open("POST", "https://api.mindee.net/v1/products/guilherme-sfontes/rg/v1/predict");
    xhr.setRequestHeader("Authorization", "Token 5e21315e3ac9e4c185e26502b9b615e7");
    xhr.send(data);
  }


}
