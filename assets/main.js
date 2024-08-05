const images = [
    '1-panel-people.png', '1-wide-grosskatzen.png', '2-panel-cosplay.png', '2-wide-tiere.png', '3-panel-cosplay.png',
    '3-wide-cosplay.png', '4-panel-cosplay.png', '4-wide-tiere.png', '5-panel-people.png', '5-wide-tiere.png',
    '6-panel-people.png', '6-wide-grosskatzen.png', '7-panel-people.png', '7-wide-tiere.png', '8-panel-people.png',
    '8-wide-tiere.png', '9-panel-people.png', '9-wide-tiere.png', '10-panel-grosskatzen.png', '10-wide-tiere.png',
    '11-panel-grosskatzen.png', '11-wide-grosskatzen.png', '12-panel-grosskatzen.png', '12-wide-tiere.png', '13-panel-grosskatzen.png',
    '13-wide-tiere.png', '14-panel-grosskatzen.png', '14-wide-unterwegs.png', '15-panel-cosplay.png', '15-wide-grosskatzen.png',
    '16-panel-people.png', '16-wide-grosskatzen.png', '17-panel-tiere.png', '17-wide-grosskatzen.png', '18-panel-tiere.png',
    '18-wide-grosskatzen.png', '19-panel-tiere.png', '19-wide-unterwegs.png', '20-panel-grosskatzen.png', '20-wide-unterwegs.png',
    '21-panel-tiere.png', '21-wide-tiere.png', '22-panel-tiere.png', '22-wide-tiere.png', '23-panel-tiere.png',
    '23-wide-grosskatzen.png', '24-panel-tiere.png', '24-wide-grosskatzen.png', '25-panel-tiere.png', '26-panel-cosplay.png',
    '27-panel-grosskatzen.png', '28-panel-cosplay.png', '29-panel-cosplay.png', '30-panel-cosplay.png', '31-panel-cosplay.png',
    '32-panel-tiere.png', '33-panel-tiere.png', '34-panel-tiere.png', '35-panel-grosskatzen.png', '36-panel-grosskatzen.png',
    '37-panel-grosskatzen.png', '38-panel-cosplay.png', '39-panel-cosplay.png', '40-panel-cosplay.png', '41-panel-cosplay.png',
    '42-panel-grosskatzen.png', '43-panel-tiere.png', '44-panel-tiere.png', '45-panel-grosskatzen.png', '46-panel-grosskatzen.png',
    '47-panel-grosskatzen.png', '48-panel-grosskatzen.png', '49-panel-grosskatzen.png', '50-panel-grosskatzen.png', '51-panel-grosskatzen.png',
    '52-panel-cosplay.png', '53-panel-cosplay.png', '54-panel-tiere.png', '55-panel-tiere.png', '56-panel-grosskatzen.png',
    '57-panel-tiere.png', '58-panel-cosplay.png', '59-panel-cosplay.png', '60-panel-cosplay.png', '61-panel-cosplay.png',
    '62-panel-cosplay.png', '63-panel-tiere.png', '64-panel-tiere.png', '65-panel-grosskatzen.png', '66-panel-unterwegs.png',
    '67-panel-unterwegs.png', '68-panel-unterwegs.png', '69-panel-grosskatzen.png', '70-panel-tiere.png', '71-panel-tiere.png',
    '72-panel-tiere.png', '73-panel-grosskatzen.png', '74-panel-tiere.png', '75-panel-grosskatzen.png', '76-panel-tiere.png'
];

let panelImageCount = 76,
    wideImageCount = 24;

var random = new Alea('d475cd732a88d87ff387b126549a6aa3');

const shuffled_data = images
    .map(value => ({ value, sort: random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

const available_slots = ['left', 'center', 'right'];
const filename_pattern = 'container-category-number.extension';
const categories = ['people', 'cosplay', 'grosskatzen', 'tiere', 'unterwegs'];
const slideshow_regular = document.getElementById('regular');
const slideshow_wide = document.getElementById('wide');
const maxLastFilenames = 10;

slideshow_regular.style.transition = 'opacity 0.35s';
slideshow_wide.style.transition = 'opacity 0.35s';
slideshow_wide.style.opacity = 0;
slideshow_regular.style.opacity = 1;

let next_available_slots = [...available_slots],
    timeoutInterval = 12500,
    slot = false,
    lastImageWide = false,
    lastFilenames = [],
    initializeSlideshow = true;
    initializeCount = 0;

const getRandomInt = (min, max) =>
    Math.floor(random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));

const getFilename = (availableFilenames) => {
    let filteredFilenames = availableFilenames.filter(
        filename => !lastFilenames.includes(filename)
    );

    if (filteredFilenames.length === 0) {
        filteredFilenames = availableFilenames;
    }

    let index = Math.floor(Math.random() * filteredFilenames.length),
        filename = filteredFilenames[index],
        wide = filename.includes('wide');

    lastImageWide = lastFilenames.slice(-5).filter(f => f.includes('wide')).length >= 2;

    if (lastImageWide && wide) {
        try {
            // console.log('Skipping wide image due to recent wide images');
            return getFilename(availableFilenames);
        } catch (e) {
            console.error('Error', e);
        }
    }

    let category = filename.split('-')[2];
    let categoryCount = lastFilenames.slice(-4).filter(f => !f.includes('wide') && f.includes(category)).length;
    
    if (categoryCount >= 1) {
        try {
            // console.log(`Skipping image from category ${category.slice(0, -3)} due to recent images from the same category`);
            return getFilename(availableFilenames);
        } catch (e) {
            console.error('Error', e);
        }
    }

    lastFilenames.push(filename);
    if (lastFilenames.length > maxLastFilenames) {
        lastFilenames.shift();
    }

    return filename;
};

const changeImage = (imageElement, newSrc) => {
    imageElement.style.transition = 'opacity 0.35s';
    imageElement.style.opacity = 0;

    imageElement.addEventListener('transitionend', function onFadeOut() {
        imageElement.src = newSrc;
        imageElement.removeEventListener('transitionend', onFadeOut);
        imageElement.style.transition = 'opacity 0.35s';
        imageElement.style.opacity = 1;
    });
};

const updateSlideshow = (next_available_slots) => {
    let availableFilenames = shuffled_data.filter(
        filename => !Object.values(lastFilenames).includes(filename)
    );
    let filename = '',
        wide = false;

    if (initializeSlideshow) {
        // Skip wide images until all slots are filled
        filename = getFilename(availableFilenames.filter(f => !f.includes('wide')));
        wide = false;
    } else {
        filename = getFilename(availableFilenames);
        wide = filename.includes('wide');
    }

    if (wide && !initializeSlideshow) {
        slideshow_regular.style.opacity = 0;
        slideshow_wide.style.opacity = 1;

        slot = 'full';
        timeoutInterval = getRandomInt(12500, 17500);
        //lastImageWide = true;
    } else if (!wide && !initializeSlideshow) {
        slideshow_regular.style.opacity = 1;
        slideshow_wide.style.opacity = 0;

        slot = next_available_slots[
            Math.floor(random() * next_available_slots.length)
        ];
        next_available_slots = available_slots.filter(value => value !== slot);
        // lastImageWide = false;
    } else {
        timeoutInterval = 5000;

        switch(initializeCount) {
            case 0:
                slot = 'center';
                break;
            case 1:
                slot = 'left';
                break;
            case 2:
                slot = 'right';
                break;
        }

        if (initializeCount === 2) {
            initializeSlideshow = false;
        }

        initializeCount++;
    }

    let imageElement = document.getElementById(slot),
        newSrc = 'assets/images/slideshow2/' + filename;

    changeImage(imageElement, newSrc);
    setTimeout(() => {
        updateSlideshow(next_available_slots);
    }, timeoutInterval);
};

setTimeout(() => {
    updateSlideshow(next_available_slots);
}, 5000);
