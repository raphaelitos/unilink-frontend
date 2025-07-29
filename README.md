# Unilink
## Descrição
O UniLink foi desenvolvido com o objetivo de centralizar e divulgar informações sobre os projetos de extensão da UFES - Goiabeiras, para que estudantes descubram e conheçam, mais facilmente, as iniciativas disponíveis. A plataforma oferece uma visualização simples e intuitiva de todos os projetos, no qual o usuário poderá buscar por nome, filtrar por centro de ensino, verificar quais projetos estão com inscrições abertas e explorar as opções por tags — palavras-chave que identificam o nicho ou característica principal de cada projeto (como "tecnologia", "saúde", "educação", entre outros). O foco é proporcionar uma ferramenta rápida e acessível para que os alunos encontrem informações essenciais sobre os projetos e possam participar ativamente das oportunidades oferecidas pela universidade.

Este repositório contempla o frontend da aplicação. O repositório do backend está disponível [aqui](https://github.com/joaoloss/unilink-backend)

## Organização do Projeto

* **Build:** Realizado com [Next.js](https://nextjs.org/)
* **Estilização:** Baseado em [Tailwind CSS](https://tailwindcss.com/) com componentes de [shadcn/ui](https://ui.shadcn.com/)
* **Versionamento:** Controlado com [GitHub](https://github.com/)
* **Integração contínua:** Automatizado via [GitHub Actions](https://docs.github.com/pt/actions)

## Documentação do Código

A documentação técnica dos arquivos TypeScript é gerada automaticamente com **TypeDoc**. Para gerar a documentação localmente, execute:

```bash
npx typedoc
```

## Como Executar o Projeto

Pré-requisito: **Node.js** (versão 18 ou superior).

1. **Clone o repositório:**

```bash
git clone https://github.com/raphaelitos/unilink-frontend.git
cd unilink-frontend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Execute o servidor de desenvolvimento:**

```bash
npm run dev
```

4. **Acesse no navegador:**

```
http://localhost:3000
```
