export class InMemoryDataService {
  createDb() {
    let artists = [
      { id: "2ff63f00-0954-4b14-9007-e19b822fc8b2", name: "Ellen Allien", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ellen_Allien_%28MAGMA_2006%2C_Tenerife%29.jpg" } },
      { id: "97b20fe3-0924-4a5f-9955-d0b5c5f9587f", name: "Santigold", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Santigold_at_University_of_Chicago.jpg" } },
      { id: "1dcc8968-f2cd-441c-beda-6270f70f2863", name: "Hole", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/e/e2/HoleSXSW2010%28wide%29.jpg" } },
      { id: "6514cffa-fbe0-4965-ad88-e998ead8a82a", name: "Fela Kuti", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Fela_Kuti.jpg" } },
      { id: "e795e03d-b5d5-4a5f-834d-162cfb308a2c", name: "PJ Harvey", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/49/PJ_Harvey_in_2011.jpg" } },
      { id: "ae0b2424-d4c5-4c54-82ac-fe3be5453270", name: "Arvo Pärt", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/9/94/Arvo_P%C3%A4rt.jpg" } },
      { id: "b6b2bb8d-54a9-491f-9607-7b546023b433", name: "Pixies", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/6/65/Pixies_in_Kansas_City%2C_October_1%2C_2004.jpg" } },
      { id: "ca405011-906d-4090-992f-f230739278b1", name: "Dum Dum Girls", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Dum_Dum_Girls_Linz_2011.jpg" } },
      { id: "f6f2326f-6b25-4170-b89d-e235b25508e8", name: "Sigur Ros", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/8/85/Reykjavik05a-01.jpg" } },
      { id: "52d9bff7-1776-46ae-8e1b-7a76afc73358", name: "Pan Sonic", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/8/87/Pansonic2.jpg" } },
      { id: "11714cac-2329-4983-9627-c83b0d5475b4", name: "Giacinto Scelsi", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/47/Giacinto_Scelsi.jpg" } },
      { id: "6f5064bb-7dbb-4a44-bac5-04c467394817", name: "Fatoumata Diawara", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/7/75/Fatoumata_Diawara_-_Festival_du_Bout_du_Monde_2012_-_016.jpg" } },
      { id: "96003ca6-5c03-4771-8b94-dbdc74949125", name: "Angel Haze", image: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/57/Angel_Haze.jpg" } }
    ];
    return { artists };
  }
}
