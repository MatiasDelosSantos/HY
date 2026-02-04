VERSION 5.00
Object = "{00025600-0000-0000-C000-000000000046}#5.2#0"; "Crystl32.OCX"
Begin VB.Form frmcuentas 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Cuentas"
   ClientHeight    =   4965
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   7125
   LinkTopic       =   "Form1"
   ScaleHeight     =   4965
   ScaleWidth      =   7125
   StartUpPosition =   2  'CenterScreen
   Begin VB.CommandButton cmdsalir 
      BackColor       =   &H000000FF&
      Caption         =   "Salir"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1095
      Left            =   5280
      Picture         =   "frmcuentas.frx":0000
      Style           =   1  'Graphical
      TabIndex        =   5
      Top             =   3720
      Width           =   1575
   End
   Begin VB.ComboBox cborazon 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   510
      Left            =   120
      TabIndex        =   3
      Top             =   1560
      Width           =   3255
   End
   Begin VB.CommandButton cmdmovi 
      BackColor       =   &H0080FF80&
      Caption         =   "Cuentas"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   5280
      Picture         =   "frmcuentas.frx":2982
      Style           =   1  'Graphical
      TabIndex        =   2
      Top             =   2400
      Width           =   1575
   End
   Begin VB.CommandButton cmdbuscar 
      BackColor       =   &H0080FF80&
      Caption         =   "Presupuestos"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   5280
      Picture         =   "frmcuentas.frx":2C8C
      Style           =   1  'Graphical
      TabIndex        =   1
      Top             =   1200
      Width           =   1575
   End
   Begin Crystal.CrystalReport informe1 
      Left            =   0
      Top             =   2880
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   348160
      WindowControlBox=   -1  'True
      WindowMaxButton =   -1  'True
      WindowMinButton =   -1  'True
      PrinterCollation=   0
      WindowState     =   2
      PrintFileLinesPerPage=   60
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Movimientos de cuentas"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   1
      Left            =   1560
      TabIndex        =   4
      Top             =   120
      Width           =   4110
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Razon social"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   0
      Left            =   120
      TabIndex        =   0
      Top             =   840
      Width           =   2115
   End
End
Attribute VB_Name = "frmcuentas"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cmdsalir_Click()
Unload Me

End Sub

Private Sub cmdBuscar_Click()
If cborazon.Text <> "" Then
        informe1.ReportFileName = App.Path & "\Remito.rpt"
        informe1.SelectionFormula = "{remitodetalle.razon} in '" & cborazon.Text & "'"
        informe1.Action = 1
    

End If


End Sub



Private Sub cmdmovi_Click()
If cborazon.Text <> "" Then
        informe1.ReportFileName = App.Path & "\Remitos2.rpt"
        informe1.SelectionFormula = "{remitos.razon} in '" & cborazon.Text & "'"
        informe1.Action = 1
    

End If

End Sub

Private Sub Form_Load()
Set miBase = OpenDatabase(App.Path & "\HY.mdb", False, False)
Set miRecor = miBase.OpenRecordset("select razon from remitodetalle group by razon", dbOpenDynaset)
Set miRecor2 = miBase.OpenRecordset("select razon from remitos group by razon", dbOpenDynaset)
If miRecor.RecordCount > 0 Then
    miRecor.MoveFirst
    Do While Not miRecor.EOF
        If Not IsNull(miRecor!razon) Then
            cborazon.AddItem miRecor!razon
            
        End If
        miRecor.MoveNext
    Loop
    If cborazon.ListCount > 0 Then
        cborazon.ListIndex = 0
        
    End If
End If
    miRecor.Close

End Sub


