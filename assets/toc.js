// Select all h2 and h3 elements from the article
const headings = document.querySelectorAll('h2, h3');

// Reference to the TOC list
const tocList = document.getElementById('toc-list');

// Loop through each heading to generate TOC items
headings.forEach((heading, index) => {
    // Create a unique ID for each heading if not already present
    if (!heading.id) {
        heading.id = 'heading-' + index;
    }


    headings.forEach((heading) => {
        const headingText = heading.textContent.trim();
    // Create a list item and anchor for each heading
    if (heading.textContent !== 'Search' && heading.textContent !== 'Related Articles') {
    const tocItem = document.createElement('li');
    const tocLink = document.createElement('a');
    
 
    // Set the anchor link to the heading's ID
    tocLink.href = '#' + heading.id;
    tocLink.textContent = heading.textContent;

    
    // Append the link to the list item, and the list item to the TOC list
    tocItem.appendChild(tocLink);
    tocList.appendChild(tocItem);
    }
})

    // Adjust styling based on heading level
    if (heading.tagName.toLowerCase() === 'h3') {
        tocItem.style.marginLeft = '20px'; // Indent for h3
    }

});