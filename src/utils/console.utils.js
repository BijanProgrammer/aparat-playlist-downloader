function printStep(text) {
    console.log(`- ${text}`);
}

function printDivider() {
    console.log();
    console.log('='.repeat(80));
    console.log();
}

module.exports = {
    printStep,
    printDivider,
};
