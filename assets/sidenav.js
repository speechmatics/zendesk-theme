document.addEventListener("DOMContentLoaded", () => {
    async function fetchAll(url) {
        let results = [];
        let hasNext = true;

        while (hasNext) {
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to load data from API');
            }
            let data = await response.json();
            results = results.concat(data.articles || data.sections || data.categories);
            url = data.next_page;
            hasNext = !!url; // Continue only if there is a next page
        }

        return results;
    }

    async function fetchDataAndDisplayInSidebar() {
        try {
            const articles = await fetchAll('/api/v2/help_center/articles');
            const sections = await fetchAll('/api/v2/help_center/sections');
            const categories = await fetchAll('/api/v2/help_center/categories');
            const accessibleSections = filterSectionsByArticles(sections, articles);

            displayCategoriesAndSections(categories, accessibleSections);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function filterSectionsByArticles(sections, articles) {
        let accessibleSectionIds = new Set(articles.map(article => article.section_id));
        return sections.filter(section => accessibleSectionIds.has(section.id));
    }

    function displayCategoriesAndSections(categories, sections) {
        const container = document.getElementById("dynamicCategoryList");
        if (!container) {
            console.error("Sidebar container not found!");
            return;
        }

        let html = "";
        categories.forEach(category => {
            let categorySections = sections.filter(section => section.category_id === category.id);
            if (categorySections.length > 0) {
                html += `<li class="sidenav-item">
                            <a href='${category.html_url}' class="blocks-item-link">
                                <span class="sidenav-item-title-category"><h4>${category.name}</h4></span>
                            </a>
                            <ul class="sections-list">` +
                            categorySections.map(section => `<li>
                                <a href='${section.html_url}' class="blocks-item-link">
                                    <span class="sidenav-item-title-section"><h3>${section.name}</h3></span>
                                </a>
                            </li>`).join('') + 
                            `</ul>
                        </li>`;
            }
        });
        container.innerHTML = html;
        adjustSidebarLayout();
    }

    function adjustSidebarLayout() {
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");
        const sidebar = document.querySelector(".sidenav");
        const categoryContainer = document.querySelector(".category-container");
    
        if (!header || !footer || !sidebar || !categoryContainer) {
            console.warn("Layout adjustment skipped: Some elements are not available.");
            return; // Ensure all elements are available
        }
    
        // Function to adjust the sidebar height and position
        function adjustHeight() {
            const headerHeight = header.offsetHeight;
            const headerTop = header.offsetTop;
            const footerPosition = footer.offsetTop;
    
            const sidebarTop = headerTop + headerHeight; // Calculate top position right below the header
            const sidebarNewHeight = footerPosition - sidebarTop; // Adjust height to stretch just up to the footer
    
            sidebar.style.position = 'absolute'; // Make sure sidebar is positioned absolutely
            sidebar.style.top = `${sidebarTop}px`;
            sidebar.style.height = `${sidebarNewHeight}px`;
            categoryContainer.style.marginLeft = `${sidebar.offsetWidth}px`;
        }
    
        // Adjust the height initially and on window resize
        adjustHeight();
        window.addEventListener("resize", adjustHeight);
    
        // Setup a mutation observer to re-adjust the layout when sidebar content changes
        const observer = new MutationObserver(() => {
            adjustHeight();
        });
        observer.observe(sidebar, { childList: true, subtree: true });
    }

    fetchDataAndDisplayInSidebar();
    adjustSidebarLayout();
});
