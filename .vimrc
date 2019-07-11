set tags=./tags;/
command! CompileTags call CompileTags()
noremap <leader>ct :CompileTags<cr>

function! CompileTags()
  execute "bel term ./generate-ctags.sh"
endfunction
