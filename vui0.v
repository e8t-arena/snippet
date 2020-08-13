import ui

ui.window({
    width:    600
    height:   400
    title:    'V UI Demo'
}, [
    ui.row({
        stretch: true
        margin: {top:10,left:10,right:10,bottom:10}
    }, [
        ui.column({
            width:   200
            spacing: 13
        }, [
            ui.textbox(
                max_len:     20
                width:       200
                placeholder: 'First name'
                text:        &app.first_name
            )
            ui.textbox(
                max_len:     50
                width:       200
                placeholder: 'Last name'
                text:        &app.last_name
            )
        ])
    ])
])
