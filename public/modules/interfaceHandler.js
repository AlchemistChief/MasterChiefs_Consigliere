export function toggleSideMenuVisibility() {
    document.getElementById("sidebar").classList.toggle("hidden");
    document.getElementById("content-area").classList.toggle("expanded");
};

export function loadPartial(documentName, targetId = "content") {
    return fetch(`partials/${documentName}`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${documentName}`);
            return response.text();
        })
        .then(html => {
            const target = document.getElementById(targetId);
            if (target) target.innerHTML = html;
        })
        .catch(error => {
            console.error(error);
        });
}
