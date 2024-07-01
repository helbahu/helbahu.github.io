import './RecordTable.css'

function RecordTable (props) {

    return (
        <div className="RecordTable">
            <h4>Record Table</h4>
            <table>
                <tr>
                    <td>Color</td>
                    <td>Count</td>
                </tr>
                {Object.entries(props.data).map(color => {
                    return (
                        <tr key={color[0]}>
                            <td>{color[0]}</td>
                            <td>{color[1]}</td>
                        </tr>
                    )
                })}
            </table>            
        </div>
    )

}

export default RecordTable;