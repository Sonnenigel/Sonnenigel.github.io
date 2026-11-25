function loadBlock(elementId, fileUrl, callback) {
  const container = document.getElementById(elementId);
  if (!container) return;

  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Ошибка загрузки ${fileUrl}`);
      return response.text();
    })
    .then((html) => {
      container.innerHTML = html;
      if (callback) callback();
    })
    .catch((error) => console.error(error));
}

function updateStatusDot() {
  const dots = document.querySelectorAll(".status-dot");
  if (!dots.length) return;

  const now = new Date();
  const hour = now.getHours();

  const isAfterHours = hour < 9 || hour >= 23;

  dots.forEach((dot) => {
    if (isAfterHours) {
      dot.classList.add("is-closed");
    } else {
      dot.classList.remove("is-closed");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCallbackModal();

  updateStatusDot();
  setInterval(updateStatusDot, 60000);

  loadBlock("topbar-placeholder", "/components/topbar.html", () => {
    updateStatusDot();
  });
  loadBlock("header-placeholder", "/components/header.html", () => {
    initBurger();
  });
  loadBlock("footer-placeholder", "/components/footer.html");
});


function initBurger() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.style.display = nav.style.display === "block" ? "none" : "block";
    });
  }
}


document.addEventListener("DOMContentLoaded", () => {
  
  initCallbackModal();

  loadBlock("topbar-placeholder", "/components/topbar.html", () => {
    updateStatusDot();
    setInterval(updateStatusDot, 60000);
  });
  loadBlock("header-placeholder", "/components/header.html", () => {
    initBurger();
  });
  loadBlock("footer-placeholder", "/components/footer.html");
});
function initCallbackModal() {
  if (document.getElementById("tt-callback-modal")) return;

  const modalHTML = `
    <div id="tt-callback-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(28,25,23,0.6); backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px; overflow-y:auto;">
      <div style="background:var(--cream, #FAF7F2); border:1px solid var(--line, #E6DFD5); border-radius:24px; max-width:460px; width:100%; padding:32px; position:relative; box-shadow:0 24px 48px rgba(0,0,0,0.18); margin:auto;">
        <button type="button" id="tt-modal-close" aria-label="Закрыть" style="position:absolute; top:18px; right:18px; width:36px; height:36px; border-radius:50%; border:1px solid var(--line, #E6DFD5); background:transparent; font-size:20px; cursor:pointer; color:var(--ink, #1C1917);">×</button>
        
        <span class="section-tag" style="margin-bottom:8px;">Консультация инженера</span>
        <h3 style="font-size:24px; margin-bottom:8px;">Обратная связь</h3>
        <p style="font-size:14px; color:var(--muted, #78716C); margin-bottom:20px;">Оставьте контакты — перезвоним в течение 15 минут в рабочее время (09:00–23:00).</p>
        
        <form id="tt-callback-form" style="display:flex; flex-direction:column; gap:14px;">
          <div>
            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:6px;">Ваше имя</label>
            <input type="text" name="name" placeholder="Например, Александр" required style="width:100%; padding:12px 14px; border-radius:12px; border:1px solid var(--line, #E6DFD5); background:#fff; font-size:15px;">
          </div>
          <div>
            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:6px;">Телефон *</label>
            <input type="tel" name="phone" id="tt-phone-input" placeholder="+7 (___) ___-__-__" required style="width:100%; padding:12px 14px; border-radius:12px; border:1px solid var(--line, #E6DFD5); background:#fff; font-size:15px;">
          </div>
          <div>
            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:6px;">Комментарий или вопрос</label>
            <textarea name="comment" rows="3" placeholder="Площадь дома, какой котёл интересует или удобное время звонка" style="width:100%; padding:12px 14px; border-radius:12px; border:1px solid var(--line, #E6DFD5); background:#fff; font-size:14px; resize:vertical;"></textarea>
          </div>

          
          <div>
            <label style="display:flex; align-items:center; justify-content:center; gap:8px; padding:11px 14px; border-radius:12px; border:1px dashed var(--terra, #C65D3A); background:rgba(198,93,58,0.05); color:var(--ink, #1C1917); font-size:13px; font-weight:600; cursor:pointer; transition:background .2s;">
              <span>📎 Прикрепить план дома, фото или проект</span>
              <input type="file" id="tt-files-input" name="attachments[]" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.dwg,.zip,.rar" style="display:none;">
            </label>
            <div id="tt-files-list" style="font-size:12px; color:var(--muted, #78716C); margin-top:6px; line-height:1.4;"></div>
          </div>

          <label style="display:flex; align-items:flex-start; gap:10px; font-size:12px; color:var(--muted, #78716C); cursor:pointer; line-height:1.4;">
            <input type="checkbox" required checked style="margin-top:2px; accent-color:var(--terra, #C65D3A); width:15px; height:15px; flex-shrink:0;">
            <span>Я соглашаюсь на обработку персональных данных в соответствии с <a href="/policy.html" target="_blank" style="color:var(--terra, #C65D3A); text-decoration:underline;">политикой конфиденциальности</a></span>
          </label>

          <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:4px;">Отправить заявку →</button>
        </form>

        <div id="tt-callback-success" style="display:none; text-align:center; padding:24px 0;">
          <div style="width:52px; height:52px; border-radius:50%; background:rgba(34,197,94,0.15); color:#16a34a; font-size:26px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px;">✓</div>
          <h4 style="font-size:20px; margin-bottom:8px;">Заявка принята!</h4>
          <p style="font-size:14px; color:var(--muted, #78716C); margin-bottom:20px;">Инженер ТЕРРАТЕРМ изучит материалы и свяжется с вами в ближайшее время.</p>
          <button type="button" id="tt-modal-done" class="btn btn-ghost btn-sm">Закрыть</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("tt-callback-modal");
  const form = document.getElementById("tt-callback-form");
  const success = document.getElementById("tt-callback-success");
  const phoneInput = document.getElementById("tt-phone-input");
  const commentInput = form.querySelector('textarea[name="comment"]');
  const filesInput = document.getElementById("tt-files-input");
  const filesList = document.getElementById("tt-files-list");

  let currentSourceLabel = "";
  let attachedPdf = null;

  
  filesInput.addEventListener("change", () => {
    const files = Array.from(filesInput.files || []);
    if (!files.length) {
      filesList.textContent = "";
      return;
    }
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 15 * 1024 * 1024) {
      alert("Общий размер файлов не должен превышать 15 МБ.");
      filesInput.value = "";
      filesList.textContent = "";
      return;
    }
    filesList.innerHTML = files
      .map(f => `✓ ${f.name} (${(f.size / 1024 / 1024).toFixed(1)} МБ)`)
      .join("<br>");
  });

  
  function formatPhone(e) {
    let digits = phoneInput.value.replace(/\D/g, "");

    if (!digits) {
        phoneInput.value = "";
        return;
    }

    if (e && e.inputType === "deleteContentBackward" && digits === "7") {
        phoneInput.value = "";
        return;
    }

    if (digits.startsWith("7") || digits.startsWith("8")) {
        digits = "7" + digits.slice(1);
    } else {
        digits = "7" + digits;
    }

    digits = digits.substring(0, 11);

    let formatted = "+7";
    if (digits.length > 1) formatted += " (" + digits.substring(1, 4);
    if (digits.length >= 5) formatted += ") " + digits.substring(4, 7);
    if (digits.length >= 8) formatted += "-" + digits.substring(7, 9);
    if (digits.length >= 10) formatted += "-" + digits.substring(9, 11);

    phoneInput.value = formatted;
}

phoneInput.addEventListener("input", formatPhone);

phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value) phoneInput.value = "+7 (";
});

phoneInput.addEventListener("blur", () => {
    if (phoneInput.value === "+7 (" || phoneInput.value === "+7") {
        phoneInput.value = "";
    }
});


  phoneInput.addEventListener("input", formatPhone);
  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value) phoneInput.value = "+7 (";
  });
  phoneInput.addEventListener("blur", () => {
    if (phoneInput.value === "+7 (") phoneInput.value = "";
  });

  function detectPageContext(trigger) {
    if (trigger && trigger.dataset.prefill) return trigger.dataset.prefill;

    const prodTitle = document.getElementById("prodTitle")?.textContent?.trim();
    const prodSku = document.getElementById("prodSku")?.textContent?.trim();
    if (prodTitle) return `Интересует товар: ${prodTitle}${prodSku ? " (" + prodSku + ")" : ""}`;

    const svcTitle = document.getElementById("svcTitle")?.textContent?.trim();
    const svcPrice = document.getElementById("svcPrice")?.textContent?.trim();
    if (svcTitle) return `Интересует услуга: ${svcTitle}${svcPrice ? " (" + svcPrice + ")" : ""}`;

    const caseTitle = document.getElementById("caseTitle")?.textContent?.trim();
    if (caseTitle) return `Вопрос по объекту: ${caseTitle}`;

    const artTitle = document.getElementById("artTitle")?.textContent?.trim();
    if (artTitle) return `Вопрос по статье: ${artTitle}`;

    return "";
  }

  const openModal = (trigger = null) => {
    form.style.display = "flex";
    success.style.display = "none";
    filesList.textContent = "";

    const contextText = detectPageContext(trigger);
    commentInput.value = contextText;

    const pageTitle = document.title.replace(" — ТЕРРАТЕРМ", "").trim();
    const btnName = trigger ? trigger.textContent.replace("→", "").trim() : "Кнопка на странице";
    currentSourceLabel = contextText
      ? `${contextText} | Страница: «${pageTitle}» | Кнопка: «${btnName}»`
      : `Страница: «${pageTitle}» | Кнопка: «${btnName}»`;

    modal.style.display = "flex";
  };

  window.openCallbackModalWithFile = (prefillText, pdfBlob, fileName) => {
    attachedPdf = { blob: pdfBlob, name: fileName };
    form.style.display = "flex";
    success.style.display = "none";
    commentInput.value = prefillText;
    filesList.innerHTML = `✓ Прикреплён файл: ${fileName}`;
    currentSourceLabel = `${prefillText} | С прикреплённым PDF-расчётом`;
    modal.style.display = "flex";
  };

  const closeModal = () => {
    modal.style.display = "none";
    attachedPdf = null;
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-callback]");
    if (trigger) {
      e.preventDefault();
      openModal(trigger);
    }
  });

  document.getElementById("tt-modal-close").addEventListener("click", closeModal);
  document.getElementById("tt-modal-done").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") closeModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const rawDigits = phoneInput.value.replace(/\D/g, "");
    if (rawDigits.length < 11) {
      phoneInput.focus();
      alert("Пожалуйста, введите полный номер телефона из 11 цифр.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем...";

const formData = new FormData(form);
formData.append("source_info", currentSourceLabel);
formData.append("page", window.location.href);
if (attachedPdf && attachedPdf.blob) {
formData.append("attachments[]", attachedPdf.blob, attachedPdf.name);
}
try {
const response = await fetch("/send.php", {
method: "POST",
body: formData
});
const result = await response.json();
if (response.ok && result.status === "ok") {
form.style.display = "none";
success.style.display = "block";
form.reset();
filesList.textContent = "";
attachedPdf = null;
} else {
alert("Не удалось отправить заявку. Позвоните нам: +7 (495) 363-52-96");
}
} catch (error) {
alert("Ошибка соединения. Позвоните нам: +7 (495) 363-52-96");
} finally {
submitBtn.disabled = false;
submitBtn.textContent = originalText;
}
});
}


