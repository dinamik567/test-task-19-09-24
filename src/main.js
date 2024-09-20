"use strict";
import "./style.css";

const checkboxForm = document.getElementById("checkboxForm");
const checkboxes = checkboxForm.querySelectorAll('input[type="checkbox"]');
const box = document.querySelector(".box");
const btnCopy = document.getElementById("copy");
const btnReset = document.getElementById("reset");

//  Устанавливаем текст в textarea
box.textContent = window.location.href;

// Устанавливаем checkbox
checkboxForm.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    selectedOptions.toggleParam({
      id: e.target.id,
      name: e.target.name,
      value: e.target.value,
    });

    window.history.replaceState({}, "", selectedOptions.getUrl());
    box.textContent = selectedOptions.getUrl();
  }
});

btnCopy.addEventListener("click", (e) => {
  e.preventDefault();
  navigator.clipboard.writeText(selectedOptions.getUrl()).catch((err) => {
    alert("Ошибка копирования текста: ", err);
  });
});

const selectedOptions = {
  url: window.location.origin,
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
      const param = `${item.name}=${item.value}`;

      if (index === 0) {
        return (acc += `?${param}`);
      } else {
        return (acc += `&${param}`);
      }
    }, this.url);
  },
};

const params = new URLSearchParams(window.location.search);
checkboxes.forEach((checkbox) => {
  if (params.get(checkbox.name)) {
    checkbox.checked = true;

    selectedOptions.idCollection.add(checkbox.id);
    selectedOptions.addParam({
      id: checkbox.id,
      name: checkbox.name,
      value: checkbox.value,
    });
  }
});

btnReset.addEventListener("click", (e) => {
  e.preventDefault();

  //  обнуляем чекбокмы
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  window.history.replaceState({}, "", window.location.origin);
  selectedOptions.resetParams();
  // сброс текста
  box.textContent = selectedOptions.getUrl();
});
