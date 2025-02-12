# 💰 Convertidor de Divisas - CLI Application

![Currency Converter](https://img.shields.io/badge/Node.js-18%2B-green)
![Jest](https://img.shields.io/badge/Testing-Jest-blue)
![ESLint](https://img.shields.io/badge/Code%20Quality-ESLint-yellow)

## 📌 Descripción

Este es un **convertidor de divisas en línea** que permite obtener tasas de cambio actualizadas en tiempo real utilizando la API de [FreeCurrencyAPI](https://freecurrencyapi.com/).  
El programa está diseñado como una **aplicación de línea de comandos (CLI)** con un menú interactivo que permite realizar conversiones, ver tasas de cambio y consultar el historial de conversiones.

## 🚀 **Características Principales**
✔ Obtiene tasas de cambio actualizadas desde `freecurrencyapi.com`.  
✔ Conversión de monedas con precisión hasta 4 decimales.  
✔ Validación de entradas para evitar errores del usuario.  
✔ Historial de conversiones en la sesión actual.  
✔ Implementación de **Jest** para pruebas unitarias.  
✔ Código limpio y estructurado con **ESLint**.

---

## 🛠 **Tecnologías Utilizadas**
- **Node.js** (18+) - Entorno de ejecución.
- **Axios** - Cliente HTTP para consumir la API.
- **Readline-sync** - Entrada interactiva de usuario en la CLI.
- **Chalk** - Estilización de mensajes en consola.
- **Jest** - Pruebas automatizadas.
- **ESLint** - Control de calidad del código.

---

## 📦 **Instalación**
Sigue estos pasos para instalar y ejecutar la aplicación en tu máquina:

### 1️⃣ **Clonar el Repositorio**
```sh
git clone https://github.com/tu-usuario/currency-converter.git
cd currency-converter
