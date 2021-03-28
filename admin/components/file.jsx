export const File = ({record}) => {
    return (
        <a href={record.params.downloadLink} target="_blank">download</a>
    )
}

export default File