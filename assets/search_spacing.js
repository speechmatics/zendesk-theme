  function addSpacesToDescriptions() {
    const searchResultDescriptions = document.querySelectorAll(
      ".search-result-description"
    );

    searchResultDescriptions.forEach((element) => {
      const originalText = element.getAttribute("data-text");
      const newText = originalText.replace(/([A-Z])/g, " $1");
      element.textContent = newText;
    });
  }

  addSpacesToDescriptions();