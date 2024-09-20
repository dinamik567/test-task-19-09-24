"use strict";
import "./style.css";

const BASE_URL = "http //site";

const checkboxForm = document.getElementById("checkboxForm");
const checkboxes = checkboxForm.querySelectorAll('input[type="checkbox"]');
const box = document.querySelector(".box");
const btnCopy = document.getElementById("copy");
const btnReset = document.getElementById("reset");

checkboxForm.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    selectedOptions.toggleParam({ id: e.target.id, value: e.target.value });
    box.textContent = selectedOptions.getUrl();
  }
});

btnCopy.addEventListener("click", (e) => {
  e.preventDefault();
  navigator.clipboard.writeText(selectedOptions.getUrl()).catch((err) => {
    alert("Ошибка копирования текста: ", err);
  });
});

btnReset.addEventListener("click", (e) => {
  e.preventDefault();

  //  обнуляем чекбокмы
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  selectedOptions.resetParams();
  // сброс текста
  box.textContent = selectedOptions.getUrl();
});

const selectedOptions = {
  url: BASE_URL,
  arrayParams: [],
  idCollection: new Set(),

  addParam(query) {
    this.arrayParams.push(query);
  },

  deleteParam(queryId) {
    this.arrayParams = this.arrayParams.filter((item) => item.id !== queryId);
  },

  toggleParam(query) {
    if (this.idCollection.has(query.id)) {
      this.idCollection.delete(query.id);
      this.deleteParam(query.id);
    } else {
      this.idCollection.add(query.id);
      this.addParam(query);
    }
  },

  resetParams() {
    this.arrayParams = [];
    this.idCollection.clear();
  },

  getUrl() {
    return this.arrayParams.reduce((acc, item, index) => {
      const param = `id:${item.id}=${item.value}`;
      if (index === 0) {
        return (acc += `/?${param}`);
      } else {
        return (acc += `&${param}`);
      }
    }, this.url);
  },
};
