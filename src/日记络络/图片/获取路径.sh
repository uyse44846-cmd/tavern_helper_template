find . -name '*.jpg' -print -o -name '*.png' -print \
| sed -E "s|(.*)|https://testingcf.jsdelivr.net/gh/uyse44846-cmd/tavern_helper_template/src/日记络络/图片/\1|" \
| pbcopy
