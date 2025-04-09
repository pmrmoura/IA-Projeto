# IA-Projeto. HEART DISEASE

As doenças cardíacas representam um dos problemas de saúde mais graves na atualidade,
sendo a principal causa de mortalidade no mundo (responsáveis por 17,9 milhões de mortes
em 2019, cerca de 32% do total)​
. Esse alto impacto social e clínico reflete-se em anos de vida perdidos, redução da
qualidade de vida e custos elevados aos sistemas de saúde. A detecção precoce de
doenças cardiovasculares é fundamental para melhorar o prognóstico – identificar
pacientes de alto risco o quanto antes possibilita intervenções médicas e mudanças
de estilo de vida que podem salvar vidas​
. Entretanto, o diagnóstico nem sempre é trivial: os sintomas podem ser inespecíficos e
os médicos lidam com grandes volumes de dados clínicos.
Nesse contexto, técnicas de Inteligência Artificial (IA), em particular de Machine Learning,
surgem como aliadas para apoiar o diagnóstico e a decisão médica. Modelos de IA podem
analisar padrões complexos em dados clínicos (como resultados de exames e histórico do
paciente) e auxiliar na predição do risco de doença cardíaca. Isso pode servir como uma
segunda opinião ou sistema de apoio, alertando médicos para pacientes com alta
probabilidade de doença mesmo antes de sintomas graves se manifestarem. Em suma, a IA
aplicada à predição de doenças cardíacas visa diagnóstico precoce e suporte à decisão,

potencialmente reduzindo a mortalidade e melhorando a eficiência no tratamento dos
pacientes.
2. Descrição dos Datasets
O projeto utilizará o Heart Disease UCI Dataset, um conjunto de dados clássico de doenças
cardíacas amplamente utilizado em pesquisas de Machine Learning aplicado à saúde. Ele
está disponível publicamente no UCI Machine Learning Repository e no Kaggle. O objetivo
deste dataset é permitir a criação de modelos preditivos que auxiliem na identificação
precoce de doenças cardíacas com base em fatores clínicos.

# HeartGuard AI – Frontend

Este é o frontend do **HeartGuard AI**, uma ferramenta de predição de risco de doença cardíaca alimentada por inteligência artificial.

## 🌐 Demonstração Online

Você pode acessar a versão ao vivo aqui:  
👉 [https://healthguardai.netlify.app/](https://healthguardai.netlify.app/)

---

## 🚀 Rodar Localmente

Se preferir rodar o projeto localmente, siga os passos abaixo:

### ✅ Requisitos
- Ter o **Node.js** instalado (de preferência versão 16 ou superior)

### 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/pmrmoura/IA-Projeto
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra o navegador e acesse: `http://localhost:5173` ou a porta que o comando indicar

---

## 📝 Observações

- Certifique-se de que a API backend esteja rodando ou acessível (endpoint padrão: `https://heart-api-lbj6.onrender.com/predict`).
- Este frontend envia os dados do formulário para a API e exibe o resultado com base na predição.