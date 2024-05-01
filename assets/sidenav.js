document.addEventListener('DOMContentLoaded', function() {
    const restrictedCategoryIds = [9979381707153, 5009374896785, 4651247346321];

    fetch('/api/v2/help_center/categories.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const categories = data.categories;
        const container = document.getElementById('dynamicCategoryList');
        let html = '';
        categories.forEach(category => {
            if (!restrictedCategoryIds.includes(category.id)) {
            html += `<li class="sidenav-item">
                        <a href='${category.html_url}' class="blocks-item-link">
                            <span class="sidenav-item-title-category"><h4>${category.name}</h4></span>
                        </a>
                        <ul id='sections-${category.id}' class="sections-list"></ul>
                    </li>`;
            fetchSectionsForCategory(category.id);
            }
        });
        container.innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading categories:', error);
        document.getElementById('dynamicCategoryList').innerHTML = '<p>Error loading categories.</p>';
    });

    window.addEventListener('resize', adjustSidebarLayout);
});

function fetchSectionsForCategory(categoryId) {
    const restrictedSectionIds = [7251704257041, 7251735253649];

    fetch(`/api/v2/help_center/categories/${categoryId}/sections.json`)
    .then(response => response.json())
    .then(data => {
        const sections = data.sections;
        const sectionsContainer = document.getElementById(`sections-${categoryId}`);
        let sectionsHtml = '';
        sections.forEach(section => {
            // Assuming 'parent_id' is null for top-level sections
            if (!restrictedSectionIds.includes(section.id)) {
                if (!section.parent_section_id) {
                sectionsHtml += `<li>
                                    <a href='${section.html_url}' class="blocks-item-link">
                                        <span class="sidenav-item-title-section"><h3>${section.name}</h3></span>
                                    </a>
                                 </li>`;
            }
        }
        });
        sectionsContainer.innerHTML = sectionsHtml;
    })
    .catch(error => {
        console.log(`Error loading sections for category ${categoryId}:`, error);
    });
    adjustSidebarLayout();
}

function adjustSidebarLayout() {
  if (!document.querySelector("footer")) {
    // If the footer isn't available yet, try again shortly
    setTimeout(adjustSidebarLayout, 100);
    console.log("Waiting for footer");
    return;
  }

  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const sidebar = document.querySelector(".sidenav");
  const categoryContainer = document.querySelector(".category-container");

  if (header && footer && sidebar && categoryContainer) {
    const headerRect = header.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    const sidebarHeight = footerRect.top - headerRect.bottom;

    sidebar.style.top = `${headerRect.bottom}px`;
    sidebar.style.height = `${sidebarHeight}px`;
    categoryContainer.style.marginLeft = `${sidebar.offsetWidth}px`;
  }
}
