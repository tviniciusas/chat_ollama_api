# Gitflow Workflow

Este documento descreve o padrão de versionamento e fluxo de trabalho utilizado neste projeto, baseado no modelo **Gitflow**.

## 1. Visão Geral Visual

O diagrama abaixo ilustra o ciclo de vida completo do desenvolvimento, desde a criação de funcionalidades até correções críticas em produção.

```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel':false,'mainBranchName': 'main'}} }%%
gitGraph
   commit tag: "v0.0.1"
   branch develop
   checkout develop
   commit
   branch feature/nova-func
   commit
   commit
   checkout develop
   merge feature/nova-func
   commit
   branch release/v1.0.0
   commit
   checkout main
   merge release/v1.0.0 tag: "v1.0.0"
   checkout develop
   merge release/v1.0.0
   checkout main
   branch hotfix/fix-login
   commit
   checkout main
   merge hotfix/fix-login tag: "v1.0.1"
   checkout develop
   merge hotfix/fix-login