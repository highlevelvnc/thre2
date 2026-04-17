/* ============================================
   ARVORE GENEALOGICA - FAMILIA SILVA
   ============================================ */

// ---- DATA MODEL ----
let familyTree = { members: {}, nextId: 200 };

function generateId() { return 'p' + (familyTree.nextId++); }

function createPerson(data) {
  const id = generateId();
  familyTree.members[id] = {
    id, name: data.name || '', gender: data.gender || 'M',
    birthDate: data.birthDate || '', deathDate: data.deathDate || '',
    birthPlace: data.birthPlace || '', notes: data.notes || '',
    nationality: data.nationality || '',
    spouseId: null, parentIds: [], childrenIds: []
  };
  return familyTree.members[id];
}

function getPerson(id) { return familyTree.members[id] || null; }
function getChildren(id) { return (getPerson(id)?.childrenIds || []).map(getPerson).filter(Boolean); }
function getSpouse(id) { const p = getPerson(id); return p?.spouseId ? getPerson(p.spouseId) : null; }
function getParents(id) { return (getPerson(id)?.parentIds || []).map(getPerson).filter(Boolean); }

function setSpouse(id1, id2) {
  const p1 = getPerson(id1), p2 = getPerson(id2);
  if (p1) p1.spouseId = id2;
  if (p2) p2.spouseId = id1;
}

function addChild(parentId, childId) {
  const parent = getPerson(parentId), child = getPerson(childId);
  if (parent && !parent.childrenIds.includes(childId)) parent.childrenIds.push(childId);
  if (child && !child.parentIds.includes(parentId)) child.parentIds.push(parentId);
}

function removePerson(id) {
  const person = getPerson(id);
  if (!person) return;
  if (person.spouseId) { const s = getPerson(person.spouseId); if (s) s.spouseId = null; }
  person.parentIds.forEach(pid => {
    const p = getPerson(pid); if (p) p.childrenIds = p.childrenIds.filter(c => c !== id);
  });
  person.childrenIds.forEach(cid => {
    const c = getPerson(cid); if (c) c.parentIds = c.parentIds.filter(p => p !== id);
  });
  delete familyTree.members[id];
}

// ---- INITIAL DATA ----
function loadDefaultFamily() {
  familyTree = { members: {}, nextId: 200 };

  // ===== LADO MATERNO-MATERNO (Linha Goncalves Thiago) =====

  // Gen -1 - Pentavos (pais de Domingos) - dados do FamilySearch
  const manoel = createPerson({ name: 'Manoel Goncalves Thiago Outeiro', gender: 'M', birthPlace: 'Outeiro, Braganca, Portugal', nationality: 'PT', notes: 'Pai de Domingos e Leonor Goncalves Thiago. Nacionalidade portuguesa. Sobrenome "Outeiro" indica origem da parochia de Nossa Senhora da Assuncao de Outeiro, Braganca. Casou com Joaquina provavelmente entre 1870-1874. FamilySearch ID: L152-BNZ.' });
  const joaquinaMae = createPerson({ name: 'Joaquina Goncalves Thiago Outeiro', gender: 'F', birthPlace: 'Outeiro, Braganca, Portugal', nationality: 'PT', notes: 'Mae de Domingos e Leonor Goncalves Thiago. NOME CORRIGIDO: Goncalves Thiago Outeiro (3 das 4 fontes do FamilySearch). Em 1 fonte da certidao de casamento de 1904 aparece como "Gerecules" - provavelmente erro de leitura do indexador da letra manuscrita antiga. Nacionalidade portuguesa. FamilySearch ID: L152-Y66.' });

  // ===== GEN -2 - Pais da Luiza Barbosa (tataravos de Patricia) =====
  // Descobertos via certidao de casamento de 1904 no FamilySearch
  const bernardino = createPerson({ name: 'Bernardino Barbosa Coutinho', gender: 'M', nationality: 'BR', notes: 'Pai de Luiza Barbosa Goncalves. Tataravo de Vinicius pelo lado materno. Sobrenome "Coutinho" provavelmente da mae dele. Fonte: certidao de casamento da filha Luiza de 25/02/1904 no Rio de Janeiro.' });
  const ermelinda = createPerson({ name: 'Ermelinda Barbosa Ricarda', gender: 'F', nationality: 'BR', notes: 'Mae de Luiza Barbosa Goncalves. Tataravo de Vinicius pelo lado materno. Sobrenome "Ricarda" provavelmente da mae dela. Curiosidade: marido Bernardino tambem se chama Barbosa - podem ser primos. FamilySearch ID: L152-Y2N. Fonte: certidao de casamento da filha de 1904.' });

  // Gen 0 - Tataravos (dados do FamilySearch ID L152-T3V)
  const domingos = createPerson({ name: 'Domingos Goncalves Thiago', gender: 'M', birthDate: '1875-06-21', deathDate: '1945-07-23', birthPlace: 'Outeiro, Braganca, Portugal', nationality: 'PT', notes: 'Nacionalidade portuguesa. Casou com Luiza em 25/02/1904 no Rio de Janeiro. Pedreiro, cor branca. Faleceu aos 70 anos no Rio de Janeiro. Residia na Av. dos Democraticos, 18 - RJ. Sepultado no Cemiterio Sao Francisco Xavier. Causa mortis: Mal de Bright. FamilySearch ID: L152-T3V (23 fontes).' });
  const luiza = createPerson({ name: 'Luiza Barbosa Goncalves', gender: 'F', birthDate: '1879-01-01', deathDate: '1951-04-19', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Nasceu ~1879 no Rio de Janeiro (luso-brasileira). Tinha 25 anos no casamento (25/02/1904). Filha de Bernardino Barbosa Coutinho e Ermelinda Barbosa Ricarda. Faleceu em 19/04/1951 no Rio, aos 72 anos. Certidao de obito No 18578 pag 63. FamilySearch ID: L152-LD2.' });

  // Gen 0b - IRMA do Domingos (descoberta nova - FamilySearch GD2M-XVQ)
  const leonorDomingos = createPerson({ name: 'Leonor Goncalves Thiago', gender: 'F', birthDate: '1876-01-01', deathDate: '1953-09-02', birthPlace: 'Outeiro, Braganca, Portugal', nationality: 'PT', notes: 'Irma do Domingos Goncalves Thiago. Nasceu em 1876 em Outeiro, Portugal, 1 ano depois do Domingos. Faleceu em 02/09/1953 aos 77 anos. FamilySearch ID: GD2M-XVQ.' });

  // Gen 1 - Bisavos (7 filhos confirmados de Domingos e Luiza - FamilySearch)
  const joao = createPerson({ name: 'Joao Goncalves Thiago', gender: 'M', birthDate: '1898-01-01', deathDate: '1990-01-01', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filho de Domingos e Luiza. Bisavo de Vinicius (pai da Deusedina). Casou duas vezes: 1a com Etelvina Carvalho (4 filhos), 2a com Terezinha de Jesus (mae da Deusedina). Viveu 92 anos. FamilySearch ID: L15K-1QL.' });
  const joaquina = createPerson({ name: 'Joaquina Goncalves Thiago', gender: 'F', birthDate: '1900-01-01', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filha de Domingos e Luiza. Casou com Jose Cavalcante Pereira. FamilySearch ID: GZ4H-1ZS.' });
  const anselmo = createPerson({ name: 'Anselmo Goncalves Thiago', gender: 'M', birthDate: '1894-01-01', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filho de Domingos e Luiza. FamilySearch ID: GP8X-8ZB.' });
  const zulmira = createPerson({ name: 'Zulmira Goncalves Thiago', gender: 'F', birthDate: '1902-01-01', deathDate: '1984-01-01', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filha de Domingos e Luiza. Casou com Alvaro Antunes de Carvalho. Viveu 82 anos. FamilySearch ID: L1Y1-CGZ.' });
  const manoelFilho = createPerson({ name: 'Manoel Goncalves Thiago', gender: 'M', birthDate: '1906-01-01', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filho de Domingos e Luiza. Nome homenagem ao avo Manoel. FamilySearch ID: GPZR-SKD.' });
  const leonor = createPerson({ name: 'Leonor Goncalves Thiago', gender: 'F', birthDate: '1910-01-01', deathDate: '1989-01-01', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filha de Domingos e Luiza. Viveu 79 anos. FamilySearch ID: GZ4C-QJ3.' });
  const constantino = createPerson({ name: 'Constantino Goncalves Thiago', gender: 'M', birthDate: '1910-01-01', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filho de Domingos e Luiza. Funcionario Publico, casado. Tinha 35 anos quando o pai faleceu em 1945. Declarante no obito do pai. Residia na Rua Clarimundo de Melo, 720 - RJ. FamilySearch ID: GZ4C-W7K.' });

  // Conjuges descobertos no FamilySearch
  const joseCavalcante = createPerson({ name: 'Jose Cavalcante Pedroza', gender: 'M', nationality: 'BR', notes: 'Marido de Joaquina Goncalves Thiago. Nome correto (no app anterior estava Pereira). FamilySearch ID: GYSL-FG2.' });
  const alvaro = createPerson({ name: 'Alvaro Antunes de Carvalho', gender: 'M', nationality: 'BR', notes: 'Marido de Zulmira Goncalves Thiago. FamilySearch ID: GSGD-3Y8.' });

  const terezinha = createPerson({ name: 'Terezinha de Jesus Guimaraes', gender: 'F', nationality: 'BR', notes: 'Segunda esposa de Joao Goncalves Thiago. Mae de Deusedina. Primeira esposa foi Etelvina Carvalho Goncalves.' });

  // ===== 1a ESPOSA DO JOAO (Etelvina) e filhos (tios-avos de Patricia) =====
  const etelvinaEsposa = createPerson({ name: 'Etelvina Carvalho Goncalves', gender: 'F', birthDate: '1898-01-01', deathDate: '1963-01-01', nationality: 'BR', notes: 'Primeira esposa de Joao Goncalves Thiago (bisavo de Vinicius). Viveu 65 anos. FamilySearch ID: L15K-PC2.' });

  // Filhos de Joao com Etelvina (tios-avos/meio-tios da Deusedina)
  const cylia = createPerson({ name: 'Cylia Goncalves Thiago', gender: 'F', birthDate: '1923-01-01', nationality: 'BR', notes: 'Filha de Joao e Etelvina. Meia-irma da Deusedina. Casou com Rubens Porfirio de Araujo. FamilySearch ID: GZ7Y-P7K.' });
  const joaoFilho = createPerson({ name: 'Joao Goncalves Thiago Filho', gender: 'M', birthDate: '1931-01-01', nationality: 'BR', notes: 'Filho de Joao e Etelvina. Meio-irmao da Deusedina. FamilySearch ID: GP8P-Q6P.' });
  const waldir = createPerson({ name: 'Waldir Goncalves Thiago', gender: 'M', deathDate: '2000-01-01', nationality: 'BR', notes: 'Filho de Joao e Etelvina. Meio-irmao da Deusedina. Faleceu em 2000. FamilySearch ID: L152-JKB.' });
  const waldemar = createPerson({ name: 'Waldemar Goncalves Thiago', gender: 'M', nationality: 'BR', notes: 'Filho de Joao e Etelvina. Meio-irmao da Deusedina. FamilySearch ID: L152-5F7.' });

  // Marido de Cylia
  const rubens = createPerson({ name: 'Rubens Porfirio de Araujo', gender: 'M', birthDate: '1920-01-01', nationality: 'BR', notes: 'Marido de Cylia Goncalves Thiago. FamilySearch ID: P9NX-4HB.' });

  // ===== FILHOS DE JOAQUINA + JOSE CAVALCANTE PEDROZA (primos-avos) =====
  const ary = createPerson({ name: 'Ary Goncalves Pedrosa', gender: 'M', birthDate: '1929-01-01', deathDate: '1968-01-01', nationality: 'BR', notes: 'Filho de Joaquina Goncalves Thiago e Jose Cavalcante Pedroza. Primo-avo de Patricia. Viveu 39 anos. FamilySearch ID: GYSL-TGV.' });
  const adhemar = createPerson({ name: 'Adhemar Goncalves Pedrosa', gender: 'M', birthDate: '1931-01-01', nationality: 'BR', notes: 'Filho de Joaquina e Jose Cavalcante Pedroza. Primo-avo de Patricia. FamilySearch ID: GYSG-MMH.' });
  const darcy = createPerson({ name: 'Darcy Goncalves Pedrosa', gender: 'M', birthDate: '1933-01-01', deathDate: '1995-01-01', nationality: 'BR', notes: 'Filho de Joaquina e Jose Cavalcante Pedroza. Primo-avo de Patricia. Viveu 62 anos. FamilySearch ID: GYSL-FC7.' });
  const getulio = createPerson({ name: 'Getulio Goncalves Pedrosa', gender: 'M', birthDate: '1938-01-01', deathDate: '1980-01-01', nationality: 'BR', notes: 'Filho de Joaquina e Jose Cavalcante Pedroza. Primo-avo de Patricia. Viveu 42 anos. FamilySearch ID: GYSL-L54.' });
  const adhamed = createPerson({ name: 'Adhamed Goncalves Pedrosa', gender: 'M', birthDate: '1952-01-01', deathDate: '1953-01-01', nationality: 'BR', notes: 'Filho de Joaquina e Jose Cavalcante Pedroza. Faleceu com menos de 1 ano. FamilySearch ID: GBZM-KZB.' });
  const edgard = createPerson({ name: 'Edgard Cavalcante Pedrosa', gender: 'M', nationality: 'BR', notes: 'Filho de Joaquina e Jose Cavalcante Pedroza. Primo-avo de Patricia. FamilySearch ID: GYSL-GZY.' });

  // ===== FILHOS DE ZULMIRA + ALVARO ANTUNES (primos-avos) =====
  const nelson = createPerson({ name: 'Nelson Goncalves', gender: 'M', birthDate: '1921-01-01', nationality: 'BR', notes: 'Filho de Zulmira e Alvaro Antunes de Carvalho. Primo-avo de Patricia. FamilySearch ID: GSG8-JF5.' });
  const nadyr = createPerson({ name: 'Nadyr Goncalves Antunes', gender: 'F', birthDate: '1923-01-01', nationality: 'BR', notes: 'Filha de Zulmira e Alvaro Antunes de Carvalho. Prima-avo de Patricia. Tem descendentes no FamilySearch. FamilySearch ID: GSGD-SHL.' });
  const alvaroFilho = createPerson({ name: 'Alvaro Goncalves Antunes', gender: 'M', birthDate: '1927-01-01', nationality: 'BR', notes: 'Filho de Zulmira e Alvaro Antunes de Carvalho. Primo-avo de Patricia. FamilySearch ID: GSG8-5J5.' });

  // ===== LADO MATERNO (pais do avo materno Jose Roberto de Oliveira) =====
  const victorino = createPerson({ name: 'Victorino Alves de Oliveira', gender: 'M', nationality: 'BR', notes: 'Pai de Jose Roberto de Oliveira (avo materno de Vinicius). Bisavo materno de Vinicius. Dados da certidao de nascimento de Patricia.' });
  const rufina = createPerson({ name: 'Rufina Paula de Oliveira', gender: 'F', nationality: 'BR', notes: 'Mae de Jose Roberto de Oliveira (avo materno de Vinicius). Bisavo materna de Vinicius. Dados da certidao de nascimento de Patricia.' });

  // ===== LADO PATERNO-MATERNO (Linha Xavier de Souza) =====

  // Bisavos paternos-maternos (pais de Jose Angelo)
  const valfredo = createPerson({ name: 'Valfredo Xavier de Souza', gender: 'M', nationality: 'BR', notes: 'Pai de Jose Angelo Xavier de Souza. Avo paterno de Nilcea.' });
  const josefa = createPerson({ name: 'Josefa Pessoa de Melo', gender: 'F', nationality: 'BR', notes: 'Mae de Jose Angelo Xavier de Souza. Avo paterna de Nilcea.' });

  const joseAngelo = createPerson({ name: 'Jose Angelo Xavier de Souza', gender: 'M', nationality: 'BR', notes: 'Filho de Valfredo Xavier de Souza e Josefa Pessoa de Melo. Pai de Nilcea Xavier da Silva.' });
  const carlinda = createPerson({ name: 'Carlinda Ramos da Costa', gender: 'F', nationality: 'BR', notes: 'Mae de Nilcea Xavier da Silva.' });

  // ===== AVOS (grandparents) =====
  const joseRoberto = createPerson({ name: 'Jose Roberto de Oliveira', gender: 'M', nationality: 'BR', notes: 'Filho de Victorino Alves de Oliveira e Rufina Paula de Oliveira. Avo materno de Vinicius.' });
  const deusedina = createPerson({ name: 'Deusedina Guimaraes de Oliveira', gender: 'F', nationality: 'BR', notes: 'Filha de Joao Goncalves Thiago e Terezinha de Jesus Guimaraes. Neta de Domingos Goncalves Thiago. Avo materna de Vinicius.' });

  // ATENCAO: O nome "da Silva" do Jorge Fernando foi erro de registro
  // O sobrenome correto deveria ser o do pai dele (Jose Angelo - a confirmar sobrenome)
  const joseAngeloPai = createPerson({ name: 'Jose Angelo (pai do Jorge Fernando)', gender: 'M', nationality: 'BR', notes: 'Pai do Jorge Fernando (avo paterno de Vinicius). Bisavo paterno de Vinicius. Sobrenome completo a confirmar. O sobrenome verdadeiro da linhagem paterna veio deste ancestral - "da Silva" foi erro de registro feito na certidao do Jorge Fernando.' });
  const jorgeFernando = createPerson({ name: 'Jorge Fernando da Silva', gender: 'M', nationality: 'BR', notes: 'Avo paterno de Vinicius. Pai: Jose Angelo. IMPORTANTE: O sobrenome "da Silva" foi erro de registro - o sobrenome correto deveria vir do pai Jose Angelo. A familia NAO e "da Silva" originalmente.' });
  const nilcea = createPerson({ name: 'Nilcea Xavier da Silva', gender: 'F', nationality: 'BR', notes: 'Filha de Jose Angelo Xavier de Souza e Carlinda Ramos da Costa. Avo paterna de Vinicius.' });

  // ===== PAIS =====
  const patricia = createPerson({ name: 'Patricia Guimaraes de Oliveira da Silva', gender: 'F', birthDate: '1975-02-09', birthPlace: 'Rio de Janeiro, RJ', notes: 'Nascida na Rua Conde de Bonfim. Estado da Guanabara (atual RJ).' });
  const fernando = createPerson({ name: 'Fernando Xavier da Silva', gender: 'M', birthDate: '1972-09-29', birthPlace: 'Rio de Janeiro, RJ', notes: 'Nascido no Hospital S. Francisco.' });

  // ===== TIOS (uncles/aunts) =====
  const fabio = createPerson({ name: 'Fabio Xavier da Silva', gender: 'M', birthPlace: 'Rio de Janeiro, RJ', notes: 'Irmao de Fernando Xavier da Silva. Filho de Jorge Fernando da Silva e Nilcea Xavier da Silva. Tio paterno de Vinicius. Sem filhos.' });
  const rachel = createPerson({ name: 'Rachel Guimaraes de Oliveira', gender: 'F', birthPlace: 'Rio de Janeiro, RJ', notes: 'Irma de Patricia. Filha de Jose Roberto de Oliveira e Deusedina Guimaraes de Oliveira. Tia materna de Vinicius.' });
  const roberta = createPerson({ name: 'Roberta Guimaraes de Oliveira', gender: 'F', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Irma de Patricia. Filha de Jose Roberto de Oliveira e Deusedina Guimaraes de Oliveira. Tia materna de Vinicius. Faleceu ha anos.', deathDate: '2010-01-01' });

  // ===== PRIMOS =====
  const maythe = createPerson({ name: 'Maythe Oliveira Salgado', gender: 'F', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filha de Rachel Guimaraes de Oliveira. Prima de Vinicius pelo lado materno. Sobrenome "Salgado" deve ser do pai dela.' });

  // ===== VOCE =====
  const vinicius = createPerson({ name: 'Vinicius de Oliveira da Silva', gender: 'M', birthDate: '1998-09-24', birthPlace: 'Rio de Janeiro, RJ', notes: 'Nascido no Hospital Raphael de Paula Souza, Cascadura.' });

  // ===== FILHAS DO VINICIUS =====
  const jade = createPerson({ name: 'Jade Dias da Silva', gender: 'F', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filha de Vinicius de Oliveira da Silva.' });
  const clara = createPerson({ name: 'Clara Dias da Silva', gender: 'F', birthPlace: 'Rio de Janeiro, RJ', nationality: 'BR', notes: 'Filha de Vinicius de Oliveira da Silva.' });

  // ===== RELACIONAMENTOS =====

  // Manoel e Joaquina Gerecules -> Domingos e Leonor
  setSpouse(manoel.id, joaquinaMae.id);
  addChild(manoel.id, domingos.id);
  addChild(joaquinaMae.id, domingos.id);
  addChild(manoel.id, leonorDomingos.id);
  addChild(joaquinaMae.id, leonorDomingos.id);

  // Bernardino e Ermelinda -> Luiza Barbosa (lado materno)
  setSpouse(bernardino.id, ermelinda.id);
  addChild(bernardino.id, luiza.id);
  addChild(ermelinda.id, luiza.id);

  // Domingos e Luiza -> 7 filhos confirmados no FamilySearch
  // (Removi a "Etelvina Gonçalves Thiago" - era confusao com a esposa Etelvina Carvalho do Joao)
  setSpouse(domingos.id, luiza.id);
  [anselmo, joao, joaquina, zulmira, manoelFilho, leonor, constantino].forEach(filho => {
    addChild(domingos.id, filho.id);
    addChild(luiza.id, filho.id);
  });

  // Joao Goncalves Thiago casou 2 vezes:
  // 1a - Etelvina Carvalho Goncalves (mae dos 4 tios-avos: Cylia, Joao Filho, Waldir, Waldemar)
  // 2a - Terezinha de Jesus Guimaraes (mae da Deusedina)
  // Nota: como o modelo atual so suporta 1 conjuge, deixo Terezinha como conjuge "principal"
  //       e adiciono Etelvina como PAI-ALTERNATIVO dos filhos (share custody) - para ver todos

  // Joao + Terezinha -> Deusedina
  setSpouse(joao.id, terezinha.id);
  addChild(joao.id, deusedina.id);
  addChild(terezinha.id, deusedina.id);

  // Joao + Etelvina Carvalho -> 4 filhos (Cylia, Joao Filho, Waldir, Waldemar)
  [cylia, joaoFilho, waldir, waldemar].forEach(filho => {
    addChild(joao.id, filho.id);
    addChild(etelvinaEsposa.id, filho.id);
  });

  // Cylia + Rubens
  setSpouse(cylia.id, rubens.id);

  // Joaquina + Jose Cavalcante -> 6 filhos
  setSpouse(joaquina.id, joseCavalcante.id);
  [ary, adhemar, darcy, getulio, adhamed, edgard].forEach(filho => {
    addChild(joaquina.id, filho.id);
    addChild(joseCavalcante.id, filho.id);
  });

  // Zulmira + Alvaro -> 3 filhos
  setSpouse(zulmira.id, alvaro.id);
  [nelson, nadyr, alvaroFilho].forEach(filho => {
    addChild(zulmira.id, filho.id);
    addChild(alvaro.id, filho.id);
  });

  // Victorino e Rufina -> Jose Roberto
  setSpouse(victorino.id, rufina.id);
  addChild(victorino.id, joseRoberto.id);
  addChild(rufina.id, joseRoberto.id);

  // Valfredo e Josefa -> Valentino
  setSpouse(valfredo.id, josefa.id);
  addChild(valfredo.id, joseAngelo.id);
  addChild(josefa.id, joseAngelo.id);

  // Valentino e Carlinda -> Nilcea
  setSpouse(joseAngelo.id, carlinda.id);
  addChild(joseAngelo.id, nilcea.id);
  addChild(carlinda.id, nilcea.id);

  // Jose Roberto e Deusedina -> Patricia, Rachel, Roberta
  setSpouse(joseRoberto.id, deusedina.id);
  [patricia, rachel, roberta].forEach(filha => {
    addChild(joseRoberto.id, filha.id);
    addChild(deusedina.id, filha.id);
  });

  // Rachel -> Maythe (prima do Vinicius)
  addChild(rachel.id, maythe.id);

  // Jose Angelo -> Jorge Fernando (nova geracao adicionada)
  addChild(joseAngeloPai.id, jorgeFernando.id);

  // Jorge Fernando e Nilcea -> Fernando e Fabio
  setSpouse(jorgeFernando.id, nilcea.id);
  addChild(jorgeFernando.id, fernando.id);
  addChild(nilcea.id, fernando.id);
  addChild(jorgeFernando.id, fabio.id);
  addChild(nilcea.id, fabio.id);

  // Patricia e Fernando -> Vinicius
  setSpouse(patricia.id, fernando.id);
  addChild(patricia.id, vinicius.id);
  addChild(fernando.id, vinicius.id);

  // Vinicius -> Jade e Clara
  addChild(vinicius.id, jade.id);
  addChild(vinicius.id, clara.id);
}

// ---- GENERATION COMPUTATION ----
function computeGenerations() {
  const members = Object.values(familyTree.members);
  if (members.length === 0) return new Map();

  const generations = new Map();

  // Compute depth from roots for each person (max path from any root)
  function getDepth(id, visited) {
    if (visited.has(id)) return 0;
    visited.add(id);
    const p = getPerson(id);
    if (!p || p.parentIds.length === 0) return 0;
    let maxD = 0;
    for (const pid of p.parentIds) {
      maxD = Math.max(maxD, getDepth(pid, new Set(visited)) + 1);
    }
    return maxD;
  }

  members.forEach(m => generations.set(m.id, getDepth(m.id, new Set())));

  // Ensure spouses are at the same generation (take the max)
  let changed = true;
  while (changed) {
    changed = false;
    members.forEach(m => {
      if (m.spouseId) {
        const myGen = generations.get(m.id) || 0;
        const spGen = generations.get(m.spouseId) || 0;
        const maxG = Math.max(myGen, spGen);
        if (generations.get(m.id) !== maxG) { generations.set(m.id, maxG); changed = true; }
        if (generations.get(m.spouseId) !== maxG) { generations.set(m.spouseId, maxG); changed = true; }
      }
    });
    // Also ensure parents are always above children
    members.forEach(m => {
      const myGen = generations.get(m.id) || 0;
      m.parentIds.forEach(pid => {
        const pGen = generations.get(pid) || 0;
        if (pGen >= myGen) {
          generations.set(m.id, pGen + 1);
          changed = true;
        }
      });
    });
  }

  return generations;
}

// ---- LAYOUT ENGINE ----
const CARD_W = 190;
const CARD_H = 125;
const COUPLE_GAP = 45;
const FAMILY_GAP = 60;
const GEN_GAP = 120;

function getNationality(person) {
  const bp = (person.birthPlace || '').toLowerCase();
  const notes = (person.notes || '').toLowerCase();
  // Explicit nationality
  if (person.nationality === 'PT') return 'PT';
  if (person.nationality === 'BR') return 'BR';
  // Portugal markers
  if (bp.includes('portugal') || bp.includes('outeiro') || bp.includes('braganca') ||
      notes.includes('portuguesa') || notes.includes('portugal')) return 'PT';
  // Brazil markers
  if (bp.includes('rio') || bp.includes('rj') || bp.includes('brasil') || bp.includes('sao paulo') ||
      bp.includes('cascadura') || notes.includes('brasileir') || notes.includes('guanabara') ||
      notes.includes('nascido no hospital') || notes.includes('nascida na')) return 'BR';
  return '';
}

function getAge(person) {
  if (!person.birthDate) return null;
  const b = new Date(person.birthDate + 'T00:00:00');
  if (isNaN(b.getTime())) return null;
  const e = person.deathDate ? new Date(person.deathDate + 'T00:00:00') : new Date();
  if (isNaN(e.getTime())) return null;
  let age = e.getFullYear() - b.getFullYear();
  const m = e.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && e.getDate() < b.getDate())) age--;
  return age;
}

function nationalityLabel(code) {
  if (code === 'PT') return 'Portuguesa';
  if (code === 'BR') return 'Brasileira';
  return '';
}

// ---- SIDE DETECTION (paternal/maternal relative to Vinicius) ----
// Finds who is on dad's side vs mom's side of the focal person
function computeSides() {
  const sides = new Map(); // personId -> 'P' (paternal), 'M' (maternal), 'C' (central/you or your descendants)

  const members = Object.values(familyTree.members);
  const vinicius = members.find(m => m.name.includes('Vinicius'));
  if (!vinicius) return sides;

  // STEP 1: Vinicius + descendants get 'C'
  function markDescendants(id, side) {
    if (sides.has(id)) return;
    sides.set(id, side);
    const p = getPerson(id);
    if (!p) return;
    p.childrenIds.forEach(cid => markDescendants(cid, side));
  }
  markDescendants(vinicius.id, 'C');

  // STEP 2: Find father and mother of Vinicius
  const parents = vinicius.parentIds.map(getPerson).filter(Boolean);
  const father = parents.find(p => p.gender === 'M');
  const mother = parents.find(p => p.gender === 'F');

  // STEP 3: For each parent, walk UP through their direct ancestors only (no spouse leakage)
  // and mark all direct ancestors + their siblings' branches with that side
  function markBloodLine(startId, side) {
    if (!startId || sides.has(startId)) return;
    const queue = [startId];
    while (queue.length) {
      const id = queue.shift();
      if (sides.has(id)) continue;
      sides.set(id, side);
      const p = getPerson(id);
      if (!p) continue;
      // add parents (blood ancestors)
      p.parentIds.forEach(pid => { if (!sides.has(pid)) queue.push(pid); });
    }
  }

  // Mark direct blood ancestors of each side first
  markBloodLine(father?.id, 'P');
  markBloodLine(mother?.id, 'M');

  // STEP 4: Now mark SPOUSES of blood ancestors with the same side
  // (they married INTO the family branch)
  members.forEach(m => {
    if (sides.has(m.id)) return;
    if (m.spouseId) {
      const spSide = sides.get(m.spouseId);
      if (spSide === 'P' || spSide === 'M') sides.set(m.id, spSide);
    }
  });

  // STEP 5: Mark siblings of blood ancestors (children of blood ancestors who aren't direct ancestors of Vinicius)
  // e.g. uncles/aunts and great-uncles/aunts
  members.forEach(m => {
    if (sides.has(m.id)) return;
    // check if any parent has a side
    const parentSides = m.parentIds.map(pid => sides.get(pid)).filter(s => s === 'P' || s === 'M');
    if (parentSides.length > 0) {
      // use the first parent's side
      sides.set(m.id, parentSides[0]);
    }
  });

  // STEP 6: Again mark spouses of people we just marked (e.g. spouse of aunt)
  members.forEach(m => {
    if (sides.has(m.id)) return;
    if (m.spouseId) {
      const spSide = sides.get(m.spouseId);
      if (spSide === 'P' || spSide === 'M') sides.set(m.id, spSide);
    }
  });

  // STEP 7: Finally, descendants of siblings (cousins and their kids)
  // Repeat parent-check propagation
  let changed = true;
  let iters = 0;
  while (changed && iters++ < 10) {
    changed = false;
    members.forEach(m => {
      if (sides.has(m.id)) return;
      const parentSides = m.parentIds.map(pid => sides.get(pid)).filter(s => s === 'P' || s === 'M');
      if (parentSides.length > 0) {
        sides.set(m.id, parentSides[0]);
        changed = true;
      }
    });
    // Also propagate through spouses
    members.forEach(m => {
      if (sides.has(m.id)) return;
      if (m.spouseId) {
        const spSide = sides.get(m.spouseId);
        if (spSide === 'P' || spSide === 'M') { sides.set(m.id, spSide); changed = true; }
      }
    });
  }

  return sides;
}

function sideLabel(side) {
  if (side === 'P') return 'Paterno';
  if (side === 'M') return 'Materno';
  if (side === 'C') return 'Voce';
  return '';
}

function computeLayout() {
  const members = Object.values(familyTree.members);
  if (members.length === 0) return { positions: {}, connections: [], width: 600, height: 400 };

  const genMap = computeGenerations();
  const positions = {};
  const connections = [];

  // Group by generation
  const genGroups = {};
  genMap.forEach((gen, id) => {
    if (!genGroups[gen]) genGroups[gen] = [];
    genGroups[gen].push(id);
  });
  const genKeys = Object.keys(genGroups).map(Number).sort((a, b) => a - b);

  // Organize each gen into couples/singles
  function organizeGen(ids) {
    const units = [], placed = new Set();
    ids.forEach(id => {
      if (placed.has(id)) return;
      const p = getPerson(id);
      if (!p) return;
      placed.add(id);
      if (p.spouseId && ids.includes(p.spouseId) && !placed.has(p.spouseId)) {
        placed.add(p.spouseId);
        units.push({ type: 'couple', ids: [id, p.spouseId] });
      } else {
        units.push({ type: 'single', ids: [id] });
      }
    });
    return units;
  }

  function unitWidth(u) {
    return u.type === 'couple' ? CARD_W * 2 + COUPLE_GAP : CARD_W;
  }

  // Position generation 0 (top)
  const allUnits = {};
  genKeys.forEach(g => { allUnits[g] = organizeGen(genGroups[g]); });

  // Sort and order function for a generation based on existing positions
  function sortAndOrderUnits(units) {
    // For each unit, compute the average x of parents
    const unitParentCenter = units.map(unit => {
      const allParents = unit.ids.flatMap(id => getPerson(id)?.parentIds || []);
      const parentPos = allParents.map(pid => positions[pid]).filter(Boolean);
      if (parentPos.length === 0) return { unit, center: null };
      const avg = parentPos.reduce((s, p) => s + p.x + p.w / 2, 0) / parentPos.length;
      return { unit, center: avg };
    });

    // Sort: units with parent positions first (sorted by position), then units without
    unitParentCenter.sort((a, b) => {
      if (a.center === null && b.center === null) return 0;
      if (a.center === null) return 1;
      if (b.center === null) return -1;
      return a.center - b.center;
    });

    // Order couple members: person whose parents are further left goes left
    unitParentCenter.forEach(({ unit }) => {
      if (unit.type !== 'couple') return;
      const [id1, id2] = unit.ids;
      const p1parents = (getPerson(id1)?.parentIds || []).map(pid => positions[pid]).filter(Boolean);
      const p2parents = (getPerson(id2)?.parentIds || []).map(pid => positions[pid]).filter(Boolean);
      const avg1 = p1parents.length > 0 ? p1parents.reduce((s, p) => s + p.x, 0) / p1parents.length : null;
      const avg2 = p2parents.length > 0 ? p2parents.reduce((s, p) => s + p.x, 0) / p2parents.length : null;
      if (avg1 !== null && avg2 !== null) {
        if (avg2 < avg1) unit.ids = [id2, id1];
      } else if (avg1 !== null && avg2 === null) {
        // id1 has parents, id2 doesn't — put id1 on side closest to parents
        const allXs = Object.values(positions).map(p => p.x);
        const cx = allXs.length > 0 ? (Math.min(...allXs) + Math.max(...allXs)) / 2 : 0;
        if (avg1 > cx) unit.ids = [id2, id1]; // id1's parents are right, so id1 goes right
      } else if (avg2 !== null && avg1 === null) {
        const allXs = Object.values(positions).map(p => p.x);
        const cx = allXs.length > 0 ? (Math.min(...allXs) + Math.max(...allXs)) / 2 : 0;
        if (avg2 < cx) unit.ids = [id2, id1]; // id2's parents are left, so id2 goes left
      } else {
        // Neither has parents: male goes left
        if (getPerson(id1)?.gender === 'F' && getPerson(id2)?.gender === 'M') unit.ids = [id2, id1];
      }
    });

    return unitParentCenter.map(u => u.unit);
  }

  // First pass: position gen 0 simply left to right
  {
    const units = allUnits[genKeys[0]];
    let totalW = units.reduce((s, u, i) => s + unitWidth(u) + (i > 0 ? FAMILY_GAP : 0), 0);
    let x = 60;
    const y = 50;
    units.forEach(unit => {
      if (unit.type === 'couple') {
        positions[unit.ids[0]] = { x, y, w: CARD_W, h: CARD_H };
        positions[unit.ids[1]] = { x: x + CARD_W + COUPLE_GAP, y, w: CARD_W, h: CARD_H };
      } else {
        positions[unit.ids[0]] = { x, y, w: CARD_W, h: CARD_H };
      }
      x += unitWidth(unit) + FAMILY_GAP;
    });
  }

  // Position subsequent generations
  const SIBLING_GAP = 25;

  for (let gi = 1; gi < genKeys.length; gi++) {
    const gen = genKeys[gi];
    let units = sortAndOrderUnits(allUnits[gen]);
    allUnits[gen] = units;
    const y = 50 + gi * (CARD_H + GEN_GAP);

    // Group units by shared parent set (siblings go together)
    const unitMeta = units.map(unit => {
      const allParentIds = [...new Set(unit.ids.flatMap(id => getPerson(id)?.parentIds || []))];
      const parentPos = allParentIds.map(pid => positions[pid]).filter(Boolean);
      let center = null;
      if (parentPos.length > 0) {
        const minX = Math.min(...parentPos.map(p => p.x));
        const maxX = Math.max(...parentPos.map(p => p.x + p.w));
        center = (minX + maxX) / 2;
      }
      const parentKey = allParentIds.length > 0 ? allParentIds.slice().sort().join(',') : null;
      return { unit, center, parentKey };
    });

    // Build sibling groups (same parents = same group)
    const sibGroups = {};
    const orphanUnits = [];
    unitMeta.forEach(um => {
      if (um.parentKey) {
        if (!sibGroups[um.parentKey]) sibGroups[um.parentKey] = { center: um.center, items: [] };
        sibGroups[um.parentKey].items.push(um);
      } else {
        orphanUnits.push(um);
      }
    });

    // Position each sibling group centered under parents
    const groupBlocks = [];

    Object.values(sibGroups).forEach(group => {
      const totalW = group.items.reduce((sum, um, i) =>
        sum + unitWidth(um.unit) + (i > 0 ? SIBLING_GAP : 0), 0);
      let x = group.center !== null ? group.center - totalW / 2 : 200;
      group.items.forEach(um => {
        um.unit.ids.forEach((id, j) => {
          positions[id] = { x: x + j * (CARD_W + COUPLE_GAP), y, w: CARD_W, h: CARD_H };
        });
        x += unitWidth(um.unit) + SIBLING_GAP;
      });
      const firstX = group.center !== null ? group.center - totalW / 2 : 200;
      groupBlocks.push({ startX: firstX, endX: firstX + totalW });
    });

    // Position orphan units (no parents) at the end
    orphanUnits.forEach(um => {
      const allPositioned = Object.values(positions).filter(p => p.y === y);
      let x = allPositioned.length > 0 ? Math.max(...allPositioned.map(p => p.x + p.w)) + FAMILY_GAP : 200;
      um.unit.ids.forEach((id, j) => {
        positions[id] = { x: x + j * (CARD_W + COUPLE_GAP), y, w: CARD_W, h: CARD_H };
      });
    });

    // Resolve overlaps between different groups (keep units within groups intact)
    const allCards = units.flatMap(u => u.ids.map(id => ({ id, pos: positions[id] })));
    allCards.sort((a, b) => a.pos.x - b.pos.x);
    for (let i = 1; i < allCards.length; i++) {
      const prev = allCards[i - 1].pos;
      const curr = allCards[i].pos;
      const minGap = 18;
      const overlap = (prev.x + prev.w + minGap) - curr.x;
      if (overlap > 0) {
        for (let j = i; j < allCards.length; j++) allCards[j].pos.x += overlap;
      }
    }
  }

  // Normalize: ensure all x >= 40
  const allPos = Object.values(positions);
  if (allPos.length > 0) {
    const minX = Math.min(...allPos.map(p => p.x));
    if (minX < 40) {
      const shift = 40 - minX;
      allPos.forEach(p => p.x += shift);
    }
  }

  // Generate couple connections
  genKeys.forEach(gen => {
    const units = allUnits[gen];
    units.forEach(unit => {
      if (unit.type === 'couple') {
        const p1 = positions[unit.ids[0]], p2 = positions[unit.ids[1]];
        if (p1 && p2) {
          connections.push({
            type: 'couple',
            x1: p1.x + p1.w, y1: p1.y + p1.h / 2,
            x2: p2.x, y2: p2.y + p2.h / 2
          });
        }
      }
    });
  });

  // Generate parent-child connections
  Object.values(familyTree.members).forEach(person => {
    if (person.parentIds.length === 0) return;
    const childPos = positions[person.id];
    if (!childPos) return;

    const parentPos = person.parentIds.map(pid => positions[pid]).filter(Boolean);
    if (parentPos.length === 0) return;

    const parentCenterX = parentPos.reduce((s, p) => s + p.x + p.w / 2, 0) / parentPos.length;
    const parentBottomY = parentPos[0].y + CARD_H;

    connections.push({
      type: 'parent-child',
      x1: parentCenterX, y1: parentBottomY,
      x2: childPos.x + childPos.w / 2, y2: childPos.y
    });
  });

  const finalPositions = Object.values(positions);
  const width = finalPositions.length > 0 ? Math.max(...finalPositions.map(p => p.x + p.w)) + 60 : 600;
  const height = finalPositions.length > 0 ? Math.max(...finalPositions.map(p => p.y + p.h)) + 60 : 400;

  return { positions, connections, width: Math.max(width, 600), height: Math.max(height, 400) };
}

// ---- RENDERING ----
function getInitials(name) {
  return name.split(' ').filter(w => w.length > 2 || w === name.split(' ')[0])
    .slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

let selectedPersonId = null;

function renderTree() {
  const { positions, connections, width, height } = computeLayout();
  const svg = document.getElementById('connectionsSvg');
  const cardsDiv = document.getElementById('treeCards');

  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.width = width + 'px';
  svg.style.height = height + 'px';

  // SVG connections
  let svgContent = '<defs><marker id="arrow" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4" fill="none"/></marker></defs>';

  connections.forEach(conn => {
    if (conn.type === 'couple') {
      const midX = (conn.x1 + conn.x2) / 2;
      svgContent += `<line class="connection-line couple" x1="${conn.x1}" y1="${conn.y1}" x2="${conn.x2}" y2="${conn.y2}"/>`;
      svgContent += `<text class="couple-heart" x="${midX}" y="${conn.y1}">&#9829;</text>`;
    } else {
      const midY = conn.y1 + (conn.y2 - conn.y1) * 0.5;
      svgContent += `<path class="connection-line" d="M${conn.x1},${conn.y1} C${conn.x1},${midY} ${conn.x2},${midY} ${conn.x2},${conn.y2}"/>`;
    }
  });
  svg.innerHTML = svgContent;

  // Compute maternal/paternal sides
  const sides = computeSides();

  // Cards
  let cardsHTML = '';
  Object.entries(positions).forEach(([id, pos]) => {
    const person = getPerson(id);
    if (!person) return;

    const gc = person.gender === 'M' ? 'male' : 'female';
    const sel = selectedPersonId === id ? 'selected' : '';
    const initials = getInitials(person.name);
    const nat = getNationality(person);
    const natClass = nat === 'BR' ? 'nat-br' : (nat === 'PT' ? 'nat-pt' : 'nat-unknown');
    const flag = nat === 'BR' ? '🇧🇷' : (nat === 'PT' ? '🇵🇹' : '');
    const age = getAge(person);
    const side = sides.get(id) || '';
    const sideClass = side ? 'side-' + side.toLowerCase() : '';
    const sideStr = sideLabel(side);

    let ageStr = '';
    if (age !== null) {
      if (person.deathDate) {
        ageStr = `Faleceu aos ${age} anos`;
      } else if (age > 110) {
        ageStr = 'Falecido(a)';
      } else {
        ageStr = `${age} anos`;
      }
    }

    let dateInfo = '';
    if (person.birthDate) {
      dateInfo = formatDate(person.birthDate);
      if (person.deathDate) dateInfo += ' - ' + formatDate(person.deathDate);
    } else if (person.deathDate) {
      dateInfo = '† ' + formatDate(person.deathDate);
    }

    cardsHTML += `
      <div class="person-card ${gc} ${natClass} ${sideClass} ${sel}" data-id="${id}"
           style="left:${pos.x}px;top:${pos.y}px;width:${pos.w}px;"
           onclick="selectPerson('${id}')">
        ${flag ? `<span class="card-flag">${flag}</span>` : ''}
        <span class="card-badge">${person.gender === 'M' ? 'M' : 'F'}</span>
        ${sideStr ? `<span class="card-side-badge side-${side.toLowerCase()}">${sideStr}</span>` : ''}
        <div class="card-avatar">${initials}</div>
        <div class="card-name">${person.name}</div>
        ${ageStr ? `<div class="card-info card-age">${ageStr}</div>` : ''}
        ${dateInfo ? `<div class="card-info">${dateInfo}</div>` : ''}
        ${person.birthPlace ? `<div class="card-info card-place">${person.birthPlace}</div>` : ''}
      </div>`;
  });
  cardsDiv.innerHTML = cardsHTML;

  // Stats
  const members = Object.values(familyTree.members);
  document.getElementById('totalMembers').textContent = members.length;
  const gens = new Set();
  computeGenerations().forEach(g => gens.add(g));
  document.getElementById('totalGenerations').textContent = gens.size;

  // Viewport size
  const vp = document.getElementById('treeViewport');
  vp.style.width = width + 'px';
  vp.style.height = height + 'px';

  saveData();
}

// ---- PAN & ZOOM ----
let zoom = 1, panX = 0, panY = 0, isPanning = false, panStartX = 0, panStartY = 0;

function updateTransform() {
  document.getElementById('treeViewport').style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
  document.getElementById('zoomLevel').textContent = Math.round(zoom * 100) + '%';
}

function centerTree() {
  const container = document.getElementById('treeContainer');
  const vp = document.getElementById('treeViewport');
  const cR = container.getBoundingClientRect();
  const vW = parseInt(vp.style.width) || 800;
  const vH = parseInt(vp.style.height) || 600;
  zoom = Math.min(cR.width / (vW + 80), cR.height / (vH + 80), 1);
  zoom = Math.max(zoom, 0.2);
  panX = (cR.width - vW * zoom) / 2;
  panY = (cR.height - vH * zoom) / 2;
  updateTransform();
}

function initPanZoom() {
  const container = document.getElementById('treeContainer');

  container.addEventListener('mousedown', e => {
    if (e.target.closest('.person-card')) return;
    isPanning = true;
    panStartX = e.clientX - panX;
    panStartY = e.clientY - panY;
    container.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (!isPanning) return;
    panX = e.clientX - panStartX;
    panY = e.clientY - panStartY;
    updateTransform();
  });
  window.addEventListener('mouseup', () => { isPanning = false; document.getElementById('treeContainer').style.cursor = 'grab'; });

  container.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    const nz = Math.max(0.15, Math.min(2.5, zoom + delta));
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    panX = mx - (mx - panX) * (nz / zoom);
    panY = my - (my - panY) * (nz / zoom);
    zoom = nz;
    updateTransform();
  }, { passive: false });

  // Touch
  let lastDist = 0;
  container.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      isPanning = true;
      panStartX = e.touches[0].clientX - panX;
      panStartY = e.touches[0].clientY - panY;
    } else if (e.touches.length === 2) {
      isPanning = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist = Math.sqrt(dx * dx + dy * dy);
    }
  });
  container.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1 && isPanning) {
      panX = e.touches[0].clientX - panStartX;
      panY = e.touches[0].clientY - panStartY;
      updateTransform();
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nz = Math.max(0.15, Math.min(2.5, zoom * (dist / lastDist)));
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      panX = mx - (mx - panX) * (nz / zoom);
      panY = my - (my - panY) * (nz / zoom);
      zoom = nz;
      lastDist = dist;
      updateTransform();
    }
  }, { passive: false });
  container.addEventListener('touchend', () => { isPanning = false; });

  document.getElementById('zoomInBtn').addEventListener('click', () => { zoom = Math.min(2.5, zoom + 0.15); updateTransform(); });
  document.getElementById('zoomOutBtn').addEventListener('click', () => { zoom = Math.max(0.15, zoom - 0.15); updateTransform(); });
  document.getElementById('centerBtn').addEventListener('click', centerTree);
}

// ---- SELECTION & EDIT ----
function selectPerson(id) {
  selectedPersonId = id;
  const person = getPerson(id);
  if (!person) return;

  document.getElementById('editId').value = id;
  document.getElementById('editName').value = person.name;
  document.getElementById('editGender').value = person.gender;
  document.getElementById('editBirthDate').value = person.birthDate;
  document.getElementById('editDeathDate').value = person.deathDate;
  document.getElementById('editBirthPlace').value = person.birthPlace;
  document.getElementById('editNotes').value = person.notes;

  const avatar = document.getElementById('panelAvatar');
  avatar.className = 'avatar-large ' + (person.gender === 'M' ? 'male' : 'female');
  avatar.textContent = getInitials(person.name);
  document.getElementById('panelTitle').textContent = person.name.split(' ')[0];

  document.getElementById('addSpouseBtn').disabled = !!person.spouseId;
  document.getElementById('addSpouseBtn').style.opacity = person.spouseId ? '0.4' : '1';
  const hasParents = person.parentIds.length >= 2;
  document.getElementById('addParentBtn').disabled = hasParents;
  document.getElementById('addParentBtn').style.opacity = hasParents ? '0.4' : '1';
  document.getElementById('addSiblingBtn').disabled = person.parentIds.length === 0;
  document.getElementById('addSiblingBtn').style.opacity = person.parentIds.length === 0 ? '0.4' : '1';

  document.getElementById('editPanel').classList.add('open');
  document.querySelectorAll('.person-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
}

function closePanel() {
  document.getElementById('editPanel').classList.remove('open');
  selectedPersonId = null;
  document.querySelectorAll('.person-card.selected').forEach(c => c.classList.remove('selected'));
}

// ---- ADD RELATIVE ----
let addRelationType = '', addRelativeOfId = '';

function openAddModal(type, rid) {
  addRelationType = type;
  addRelativeOfId = rid;
  const titles = { spouse: 'Adicionar Conjuge', child: 'Adicionar Filho(a)', parent: 'Adicionar Pai/Mae', sibling: 'Adicionar Irmao(a)' };
  document.getElementById('addModalTitle').textContent = titles[type] || 'Adicionar';
  const person = getPerson(rid);
  if (type === 'spouse') document.getElementById('addGender').value = person.gender === 'M' ? 'F' : 'M';
  else if (type === 'parent') {
    const existing = getParents(rid);
    document.getElementById('addGender').value = existing.length === 1 ? (existing[0].gender === 'M' ? 'F' : 'M') : 'M';
  } else document.getElementById('addGender').value = 'M';

  document.getElementById('addName').value = '';
  document.getElementById('addBirthDate').value = '';
  document.getElementById('addBirthPlace').value = '';
  document.getElementById('addModal').classList.remove('hidden');
  document.getElementById('addName').focus();
}

function closeAddModal() { document.getElementById('addModal').classList.add('hidden'); }

function handleAddPerson(e) {
  e.preventDefault();
  const name = document.getElementById('addName').value.trim();
  if (!name) return;
  const np = createPerson({
    name, gender: document.getElementById('addGender').value,
    birthDate: document.getElementById('addBirthDate').value,
    birthPlace: document.getElementById('addBirthPlace').value.trim()
  });
  const rel = getPerson(addRelativeOfId);
  if (!rel) { closeAddModal(); return; }

  switch (addRelationType) {
    case 'spouse': setSpouse(rel.id, np.id); break;
    case 'child':
      addChild(rel.id, np.id);
      if (rel.spouseId) addChild(rel.spouseId, np.id);
      break;
    case 'parent':
      addChild(np.id, rel.id);
      if (rel.parentIds.length === 2) {
        const other = getPerson(rel.parentIds.find(pid => pid !== np.id));
        if (other && !other.spouseId) setSpouse(other.id, np.id);
      }
      break;
    case 'sibling':
      rel.parentIds.forEach(pid => addChild(pid, np.id));
      break;
  }
  closeAddModal();
  renderTree();
  showToast(`${name} adicionado(a)!`);
  setTimeout(() => { selectPerson(np.id); centerTree(); }, 150);
}

// ---- SAVE / LOAD ----
const STORAGE_KEY = 'familyTree_v5_sides';
function saveData() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(familyTree)); } catch (e) {} }
function loadData() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) { familyTree = JSON.parse(d); return true; }
  } catch (e) {}
  return false;
}

// ---- EXPORT / IMPORT ----
function exportData() {
  const blob = new Blob([JSON.stringify(familyTree, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'arvore_genealogica_silva.json';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Dados exportados!');
}

function importData(jsonStr) {
  try {
    const d = JSON.parse(jsonStr);
    if (d.members) { familyTree = d; renderTree(); centerTree(); closePanel(); showToast('Importado!'); }
    else showToast('Formato invalido!');
  } catch (e) { showToast('JSON invalido!'); }
}

// ---- SEARCH ----
function handleSearch(q) {
  const cards = document.querySelectorAll('.person-card');
  if (!q.trim()) { cards.forEach(c => c.classList.remove('search-match', 'search-dim')); return; }
  const norm = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  cards.forEach(card => {
    const p = getPerson(card.dataset.id);
    if (!p) return;
    const name = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const match = name.includes(norm);
    card.classList.toggle('search-match', match);
    card.classList.toggle('search-dim', !match);
  });
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  t.classList.add('show');
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.classList.add('hidden'), 300); }, 2500);
}

// ---- INIT ----
function init() {
  if (!loadData()) loadDefaultFamily();
  renderTree();
  initPanZoom();
  setTimeout(centerTree, 150);

  // Edit form
  document.getElementById('editForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const p = getPerson(id);
    if (!p) return;
    p.name = document.getElementById('editName').value.trim() || p.name;
    p.gender = document.getElementById('editGender').value;
    p.birthDate = document.getElementById('editBirthDate').value;
    p.deathDate = document.getElementById('editDeathDate').value;
    p.birthPlace = document.getElementById('editBirthPlace').value.trim();
    p.notes = document.getElementById('editNotes').value.trim();
    renderTree(); selectPerson(id);
    showToast('Atualizado!');
  });

  // Delete
  document.getElementById('deletePersonBtn').addEventListener('click', () => {
    const id = document.getElementById('editId').value;
    const p = getPerson(id);
    if (p && confirm(`Excluir ${p.name}?`)) {
      removePerson(id); closePanel(); renderTree(); showToast('Removido.');
    }
  });

  document.getElementById('closePanelBtn').addEventListener('click', closePanel);
  document.getElementById('addSpouseBtn').addEventListener('click', () => { if (selectedPersonId) openAddModal('spouse', selectedPersonId); });
  document.getElementById('addChildBtn').addEventListener('click', () => { if (selectedPersonId) openAddModal('child', selectedPersonId); });
  document.getElementById('addParentBtn').addEventListener('click', () => { if (selectedPersonId) openAddModal('parent', selectedPersonId); });
  document.getElementById('addSiblingBtn').addEventListener('click', () => { if (selectedPersonId) openAddModal('sibling', selectedPersonId); });

  document.getElementById('addForm').addEventListener('submit', handleAddPerson);
  document.getElementById('closeModalBtn').addEventListener('click', closeAddModal);
  document.getElementById('cancelAddBtn').addEventListener('click', closeAddModal);
  document.getElementById('addModal').addEventListener('click', e => { if (e.target.id === 'addModal') closeAddModal(); });

  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importModal').classList.remove('hidden');
    document.getElementById('importData').value = '';
  });
  document.getElementById('closeImportBtn').addEventListener('click', () => document.getElementById('importModal').classList.add('hidden'));
  document.getElementById('cancelImportBtn').addEventListener('click', () => document.getElementById('importModal').classList.add('hidden'));
  document.getElementById('confirmImportBtn').addEventListener('click', () => {
    const d = document.getElementById('importData').value.trim();
    if (d) { importData(d); document.getElementById('importModal').classList.add('hidden'); }
  });
  document.getElementById('importModal').addEventListener('click', e => { if (e.target.id === 'importModal') document.getElementById('importModal').classList.add('hidden'); });

  document.getElementById('searchInput').addEventListener('input', e => handleSearch(e.target.value));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closePanel(); closeAddModal();
      document.getElementById('importModal').classList.add('hidden');
      document.getElementById('searchInput').value = '';
      handleSearch('');
    }
  });

  window.addEventListener('resize', () => setTimeout(centerTree, 200));
}

document.addEventListener('DOMContentLoaded', init);
