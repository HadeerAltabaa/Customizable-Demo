const img = document.querySelector("#previewImage")

function onImageClick() {
    const rect = img.getBoundingClientRect();
    const relativeX = mouseX - rect.left;
    const relativeY = mouseY - rect.top;

    let isTop = rect.bottom / 2 > relativeY
    let isLeft = rect.right / 2 > relativeX
    let isBottom = !isTop
    let isRight = !isLeft

    area = 0

    if(isTop && isLeft)
        area = 1

    if(isTop && isRight)
        area = 2
    
    if(isBottom && isLeft)
        area = 3

    if(isBottom && isRight)
        area = 4

    // TODO: Submit to api insted of logs
    console.log(area);
    console.log({
        isTop,
        isLeft,
        isBottom,
        isRight
    })
}
