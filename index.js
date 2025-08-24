const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('modal');
const form = document.getElementById('projectForm');
const projectsContainer = document.getElementById('projectsContainer');
const defaultImage = '/project/images/logo.png';

// Show modal
openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
// Hide modal
closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
});

function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projectsContainer.innerHTML = '';

    if (projects.length === 0) {
        projectsContainer.innerHTML = '<p class="text-gray-500 text-lg">Create a new project</p>';
        return;
    }

    for(pID in projects) {
        let p = projects[pID]
        
        const card = document.createElement('div');
        card.className = 'relative rounded-lg shadow-md';
        card.id = p.id
        card.style.backgroundColor = p.color;
        const image = localStorage.getItem(`${p.id}-logoImage`)
        card.innerHTML = `
            <div class="flex-1 w-full justify-center items-center p-5">
                <img src="${image ?? defaultImage}" alt="${p.title}" class="w-fit object-cover rounded-t-lg" />  
            </div>
            <div class="px-5 pt-3">
                <h2 class="text-white font-bold text-xl">${p.title}</h2>
            </div>
            <div class="flex justify-between m-5">
                <button class="bg-white/10 hover:bg-white/30 text-white px-4 py-2 rounded-md font-semibold" onClick="localStorage.setItem('currentProject', ${p.id});window.location.href = '/project';">Go to project</button>
                <button class="text-white hover:text-gray-700 text-2xl font-bold z-[999]" onClick="deleteProject(${p.id})">&times;</button>
            </div>
        `;
        projectsContainer.appendChild(card);
    }
}

    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('projectTitle').value.trim();
    const color = document.getElementById('projectColor').value;
    const imageInput = document.getElementById('projectImage');
    let image = defaultImage;

    if (imageInput.files && imageInput.files[0]) {
        image = await fileToBase64(imageInput.files[0]);
    }

    const newProject = {
        id: Date.now().toString(),
        title,
        color,
    };

    const projects = JSON.parse(localStorage.getItem('projects') || '{}');
    projects[newProject.id] = newProject;
    localStorage.setItem('projects', JSON.stringify(projects));

    changeProjectLogoHandler(imageInput, newProject.id)

    form.reset();
    document.getElementById('projectColor').value = '#3b82f6';
    modal.classList.add('hidden');
    loadProjects();
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function deleteProject(id) {
    const projects = JSON.parse(localStorage.getItem('projects') || '{}');
    delete projects[id]
    localStorage.setItem('projects', JSON.stringify(projects));
    document.getElementById(id).remove()
}

function changeProjectLogoHandler(input, projectID) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
        localStorage.setItem(`${projectID}-logoImage`, base64Image);
    };
    reader.readAsDataURL(file);
}

loadProjects();