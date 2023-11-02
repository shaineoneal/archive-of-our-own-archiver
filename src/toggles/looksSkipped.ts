export function looksSkipped(tf: Boolean, work: Element) {

    //if true, add class 'skipped-work' to work element
    if (!tf) work.classList.remove('skipped-work');
    //if false, remove class 'skipped-work' from work element
    else {
        work.classList.add('skipped-work');
        work.addEventListener("click", function() {
            work.classList.toggle("active");
            var parent = work.parentElement!;
            parent.classList.toggle("collapsed");
            if (parent.style.display === "block") {
                parent.style.display = "none";
            } else {
                parent.style.display = "block";
            }
          });
        }
}

