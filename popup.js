console.log(`THis is DATA ${DATA}`)
const refreshData = () => {
    console.log(`REFRESHING!! This is DATA now ${DATA}`)
    const scoreElement = document.querySelector("#score")
    const summaryElemenet = document.querySelector("#summary")

    scoreElement.innerHTML = DATA.score
    summaryElemenet.innerHTML = DATA.summary
}

const refreshButton = document.querySelector("#refresh")

refreshButton.addEventListener("click", refreshData)

s