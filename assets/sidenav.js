document.addEventListener("DOMContentLoaded", () => {
    async function fetchAll(url) {
        let results = [];
        let hasNext = true;

        while (hasNext) {
            let response = await fetch(url);
            if (!response.ok) {
                console.error('Failed to load data from API', response.statusText);
                throw new Error('Failed to load data from API');
            }
            let data = await response.json();
            results = results.concat(data.articles || data.sections || data.categories);
            url = data.next_page;
            hasNext = !!url;
        }

        return results;
    }

    async function fetchDataAndDisplayInSidebar() {
        try {
            const articles = await fetchAll('/api/v2/help_center/articles');
            const sections = await fetchAll('/api/v2/help_center/sections');
            const categories = await fetchAll('/api/v2/help_center/categories');
            console.log('Data fetched:', { articles, sections, categories });  // Debugging log
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
        console.log('Sidebar updated.');  // Debugging log
    }

    fetchDataAndDisplayInSidebar();
    adjustSidebarLayout();

    function adjustSidebarLayout() {
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");
        const sidebar = document.querySelector(".sidenav");
        // Find either container, prioritizing category if both are present
        const mainContainer = document.querySelector(".category-container") || document.querySelector(".section-container") || document.querySelector(".article-container");
    
        if (!header || !footer || !sidebar || !mainContainer) {
            console.warn("Layout adjustment skipped: Some elements are not available.");
            return;
        }
    
        function adjustHeight() {
            const headerRect = header.getBoundingClientRect();
            const footerRect = footer.getBoundingClientRect();
            
            // Calculate top position right below the header considering scroll offset
            const sidebarTop = window.scrollY + headerRect.bottom;
            // Calculate the new height considering the top of the footer
            const sidebarHeight = footerRect.top - headerRect.bottom;
    
            sidebar.style.position = 'fixed'; // Use fixed positioning to handle scrolling
            sidebar.style.top = `${headerRect.bottom}px`;
            sidebar.style.height = `${sidebarHeight}px`;
            mainContainer.style.marginLeft = `${sidebar.offsetWidth}px`;
        }
    
        adjustHeight();
        window.addEventListener("resize", adjustHeight);
        window.addEventListener("scroll", adjustHeight); // Ensure the sidebar adjusts on scroll
    
        // Observe changes in the layout that might affect the size or position of the header or footer
        const observer = new ResizeObserver(adjustHeight);
        observer.observe(header);
        observer.observe(footer);
        observer.observe(mainContainer); // Observing main container for any changes that might require an adjustment
    }
});
