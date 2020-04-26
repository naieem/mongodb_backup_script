base_data_path='./dump/dump_10_5_3_21_backup_2020_4_19_1_3/*'
db_string='10.5.3.67:27017';
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