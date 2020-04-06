base_data_path='./dump_216_backup/*'
db_string='172.16.3.78:27017';
for dir in $base_data_path; do

  for file in $dir/*.json; do
    filex="$(basename -- "$file")"
    purefilename="${filex%%.*}"
    cmd='mongoimport --host '$db_string' --db '$(basename $dir)' -c '$purefilename' --upsert --file  '$file
    echo $cmd
    $cmd
  done

done
read -p "Script run completed"