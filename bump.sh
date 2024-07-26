DATE=$(date '+%Y-%m-%d')
MKT_COMMIT=$( git rev-parse --short HEAD )
IDL_COMMIT=$( cat .idl_commit )
# echo ${MKT_COMMIT}-${IDL_COMMIT}-${DATE}
yarn version --preid nightly-${MKT_COMMIT}-${IDL_COMMIT}-${DATE} --prereleaseb